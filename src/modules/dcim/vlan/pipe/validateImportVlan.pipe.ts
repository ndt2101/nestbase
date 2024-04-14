import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { validate } from 'class-validator';
import { CreateVlanDto } from '../dto/createVlan.dto';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DB_CONNECTION } from '@common/constants/global.const';
import { EntityManager } from 'typeorm';

@Injectable()
export class ValidateImportVlan implements PipeTransform {
  constructor(
    @InjectEntityManager(DB_CONNECTION.DCIM)
    private readonly entityManager: EntityManager,
  ) {}
  async transform(file: any) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[sheetName];
      let data = xlsx.utils.sheet_to_json(workSheet, {
        header: 1,
        defval: null,
      });
      data = await Promise.all(
        data.map(async (record, index) => {
          if (index != 0) {
            const payload = {
              infrastructure_type_id: record[1],
              zone_site_id: record[2],
              zone_uu_id: record[3],
              ip_type: record[4],
              subnet: record[5],
              range_ip: record[6],
              description: record[7],
              purpose: record[8],
              system: record[9],
            };

            const modifiedPayload = await this.modifyPayload(payload);
            const dtoObjects = new CreateVlanDto();
            dtoObjects.infrastructure_type_id =
              modifiedPayload.infrastructure_type_id;
            dtoObjects.zone_site_id = modifiedPayload.zone_site_id;
            dtoObjects.zone_uu_id = modifiedPayload.zone_uu_id;
            dtoObjects.ip_type = modifiedPayload.ip_type;
            dtoObjects.subnet = modifiedPayload.subnet;
            dtoObjects.range_ip = modifiedPayload.range_ip;
            dtoObjects.description = modifiedPayload.description;
            dtoObjects.vlan_name = modifiedPayload.vlan_name;
            dtoObjects.vxlan_id = modifiedPayload.vxlan_id;
            dtoObjects.vlan_id_l3 = modifiedPayload.vlan_id_l3;
            dtoObjects.vxlan_id_l3 = modifiedPayload.vxlan_id_l3;
            dtoObjects.gw = modifiedPayload.gw;
            dtoObjects.vrf = modifiedPayload.vrf;
            dtoObjects.purpose = modifiedPayload.purpose;
            dtoObjects.system = modifiedPayload.system;
            dtoObjects.vlan_id = modifiedPayload.vlan_id;

            const errors = await validate(dtoObjects);
            if (modifiedPayload.error) {
              return modifiedPayload;
            } else if (errors.length) {
              modifiedPayload.error = errors
                .map((error) => Object.values(error.constraints))
                .flat()
                .join();
            } else {
              modifiedPayload.error = null
            }

            return modifiedPayload
          }

          return record;
        }),
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async modifyPayload(payload: any) {
    const zone = await this.entityManager
      .getRepository('zone')
      .createQueryBuilder('zone')
      .where('id = :id', { id: payload.zone_uu_id })
      .getOne();

    const zoneSite = await this.entityManager
      .getRepository('zone_site')
      .createQueryBuilder('zone_site')
      .where('id = :id', { id: payload.zone_site_id })
      .getOne();
    payload.error = '';
    if (!zone) {
      payload.error = payload.error + ' Zone is not exist,';
    }

    if (!zoneSite) {
      payload.error = payload.error + ' Zone site is not exist,';
    }

    // Get existing VLAN IDs for the specified zone_site_id
    const existingVlanIdsRaw = await this.entityManager
      .getRepository('vlan')
      .createQueryBuilder('vlan')
      .where('vlan.zone_site_id = :zone_site_id', {
        zone_site_id: payload.zone_site_id,
      })
      .getMany();

    let existingVlanIds: number[] = [];
    if (existingVlanIdsRaw) {
      existingVlanIds = existingVlanIdsRaw.map((item) => item.vlan_id);
    }

    // Calculate the number of existing VLAN IDs
    const existingCount = existingVlanIds.length;

    // Check if existing VLAN IDs exceed the maximum allowed count
    if (existingCount >= 4000) {
      payload.error =
        payload.error + ' Exceeded maximum VLAN count for this Zone Site,';
    }

    // Generate a list of available VLAN IDs
    const allVlanIds = Array.from({ length: 4000 }, (_, i) => i + 1);
    const availableVlanIds = allVlanIds.filter(
      (id) => !existingVlanIds.includes(id),
    );

    const newVlanId = Math.min(...availableVlanIds);

    // If there are no available new VLAN IDs, raise an error
    if (!newVlanId) {
      payload.error =
        payload.error +
        ' Cannot create more VLANs for this Zone Site. Already reached the limit,';
    }

    const newVlanName = zone ? `${zone.name}_${newVlanId}` : null;
    const newVlanIdL3 = zone ? `${payload.zone_site_id}${zone.zone_id}` : null;
    const newVXLanIdL3 = `${newVlanIdL3}0000`;
    const newVXLanId = `${newVlanIdL3}${newVlanId}`;
    const newGw = this.calculateGateway(payload.subnet);
    const newVrf =
      zoneSite && zone
        ? `${zoneSite.name.toUpperCase()}_${zone.name.toUpperCase()}`
        : null;

    payload.vlan_name = newVlanName;
    payload.vxlan_id = newVXLanId;
    payload.vlan_id_l3 = newVlanIdL3;
    payload.vxlan_id_l3 = newVXLanIdL3;
    payload.gw = newGw;
    payload.vrf = newVrf;
    payload.vlan_id = newVlanId;

    return { ...payload };
  }
  calculateGateway(subnet: string): string {
    if (subnet && typeof subnet === 'string') {
      const [ipAddress, cidr] = subnet.toString().split('/');
      const octets = ipAddress.split('.').map(Number);
      const networkBits = parseInt(cidr);
      const hostBits = 32 - networkBits;
      const lastOctet = octets[3] + Math.pow(2, hostBits) - 2;

      return `${octets[0]}.${octets[1]}.${octets[2]}.${lastOctet}`;
    }

    return null;
  }
}
