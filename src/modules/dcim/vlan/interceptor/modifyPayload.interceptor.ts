import { DB_CONNECTION } from '@common/constants/global.const';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityManager } from 'typeorm';

@Injectable()
export class ModifyPayloadInterceptor implements NestInterceptor {
  constructor(
    @InjectEntityManager(DB_CONNECTION.DCIM)
    private readonly entityManager: EntityManager,
  ) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();

    req.body = this.modifyPayload(req.body);
    return next.handle().pipe(map((value) => (value === null ? '' : value)));
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
    if (!zone) {
      throw new BadRequestException([
        {
          field: 'zone_uu_id',
          error: 'Zone is not exist',
        },
      ]);
    }

    if (!zoneSite) {
      throw new BadRequestException([
        {
          field: 'zone_site_id',
          error: 'Zone site is not exist',
        },
      ]);
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
      throw new BadRequestException([
        {
          field: 'zone_site_id',
          error: 'Exceeded maximum VLAN count for this Zone Site.',
        },
      ]);
    }

    // Generate a list of available VLAN IDs
    const allVlanIds = Array.from({ length: 4000 }, (_, i) => i + 1);
    const availableVlanIds = allVlanIds.filter(
      (id) => !existingVlanIds.includes(id),
    );

    const newVlanId = Math.min(...availableVlanIds);

    // If there are no available new VLAN IDs, raise an error
    if (!newVlanId) {
      throw new BadRequestException([
        {
          field: 'zone_site_id',
          error:
            'Cannot create more VLANs for this Zone Site. Already reached the limit.',
        },
      ]);
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
      const [ipAddress, cidr] = subnet.split('/');
      const octets = ipAddress.split('.').map(Number);
      const networkBits = parseInt(cidr);
      const hostBits = 32 - networkBits;
      const lastOctet = octets[3] + Math.pow(2, hostBits) - 2;

      return `${octets[0]}.${octets[1]}.${octets[2]}.${lastOctet}`;
    }

    return null;
  }
}
