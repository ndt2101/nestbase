import { DB_CONNECTION } from '@common/constants/global.const';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from 'src/database/entities/postgre/Device.entity';
import { DeviceRepository } from './device.repository';
import { DeviceQueryDto } from './dto/deviceQuery.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { DeviceByPodQueryDto } from './dto/deviceByPodQuery.dto';
import { Brackets } from 'typeorm';
import { Rack } from 'src/database/entities/postgre/Rack.entity';
import { PodRepository } from '../pod/pod.repository';
import { Pod } from 'src/database/entities/postgre/Pod.entity';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device, DB_CONNECTION.DCIM)
    private readonly deviceRepository: DeviceRepository,
    @InjectRepository(Pod, DB_CONNECTION.DCIM)
    private readonly podRepository: PodRepository,
  ) {}

  async getAll(deviceQueryDto: DeviceQueryDto): Promise<PaginationDto<Device>> {
    const skipCount = (deviceQueryDto.page - 1) * deviceQueryDto.per_page;
    const query = this.deviceRepository.createQueryBuilder('dcim_device');

    if (deviceQueryDto.filter) {
      query.andWhere('dcim_device.name LIKE :pattern', {
        pattern: `%${deviceQueryDto.filter}%`,
      });
    }
    if (deviceQueryDto.site_id) {
      query.andWhere('dcim_device.site_id = :site_id', {
        site_id: deviceQueryDto.site_id,
      });
    }
    if (deviceQueryDto.location_id) {
      query.andWhere('dcim_device.location_id = :location_id', {
        location_id: deviceQueryDto.location_id,
      });
    }

    const [items, totalItems] = await query
      .skip(skipCount)
      .take(deviceQueryDto.per_page)
      .getManyAndCount();

    return new PaginationDto(
      deviceQueryDto.page,
      deviceQueryDto.per_page,
      totalItems,
      items,
    );
  }

  async getDeviceByPod(
    deviceByPodQueryDto: DeviceByPodQueryDto,
  ): Promise<PaginationDto<Device>> {
    const skipCount =
      (deviceByPodQueryDto.page - 1) * deviceByPodQueryDto.per_page;
      const podDetail =  await this.podRepository.findOne({
        relations: {
          racks: true,
          locations: true,
        },
        where: { id: deviceByPodQueryDto.pod_id },
      });
    if (podDetail) {
      let listLocationIds = []
      let listRackIds = []
      if (podDetail.locations) {
        podDetail.locations.forEach((location, index) => {
          listLocationIds.push(location.id)
        })
        if (deviceByPodQueryDto.location_ids) {
          let queryLocationIds = deviceByPodQueryDto.location_ids.split(',');
          let arrlocationIds = queryLocationIds.map((item) => {
            return parseInt(item)
          })

          listLocationIds = listLocationIds.filter(value => arrlocationIds.includes(value));
        }
      } 
      if (podDetail.racks) {
        podDetail.racks.forEach((rack, index) => {
          listRackIds.push(rack.id)
        })
        if (deviceByPodQueryDto.rack_ids) {
          const queryRackIds = deviceByPodQueryDto.rack_ids.split(',');
          let arrRackIds = queryRackIds.map((item) => {
            return parseInt(item)
          })
          listRackIds = listRackIds.filter(value => arrRackIds.includes(value));
        }
      }
      const query = this.deviceRepository
        .createQueryBuilder('dcim_device')
        .leftJoinAndSelect('dcim_device.ip_address', 'ip_address')
        .leftJoinAndSelect('dcim_device.rack', 'dcim_rack')
        .leftJoinAndSelect('dcim_device.location', 'dcim_location')
        .where(
          new Brackets((qb) => {
            if (listLocationIds.length && listRackIds.length) {
              qb.where('dcim_device.location_id IN (:...location_id)', {
                location_id: listLocationIds,
              }).orWhere('dcim_device.rack_id IN (:...rack_id)', {
                rack_id: listRackIds,
              });
            } else if (listLocationIds.length) {
              qb.where('dcim_device.location_id IN (:...location_id)', {
                location_id: listLocationIds,
              });
            } else if (listRackIds.length) {
              qb.orWhere('dcim_device.rack_id IN (:...rack_id)', {
                rack_id: listRackIds,
              });
            } else {
              qb.where('dcim_device.rack_id IN (:...rack_id)', {
                rack_id: [0],
              }).andWhere('dcim_device.location_id IN (:...location_id)', {
                location_id: [0],
              });
            }
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (deviceByPodQueryDto.device_types) {
              const listDeviceTypes = deviceByPodQueryDto.device_types.split(',');
              const checkLB = listDeviceTypes.includes('load_balancer_id')
              const checkSwitch = listDeviceTypes.includes('switch_id')
              const checkFW = listDeviceTypes.includes('firewall_id')
              if (checkLB && checkSwitch && checkFW) {
                qb.where(
                  'COALESCE(load_balancer_id, firewall_id, switch_id) IS NOT NULL',
                )
              } else if (checkLB && checkSwitch) {
                qb.where(
                  'COALESCE(load_balancer_id, switch_id) IS NOT NULL',
                )
              } else if (checkLB && checkFW) {
                qb.where(
                  'COALESCE(load_balancer_id, firewall_id) IS NOT NULL',
                )
              } else if (checkSwitch && checkFW) {
                qb.where(
                  'COALESCE(switch_id, firewall_id) IS NOT NULL',
                )
              } else if (checkFW) {
                qb.where(
                  'firewall_id IS NOT NULL',
                )
              } else if (checkSwitch) {
                qb.where(
                  'switch_id IS NOT NULL',
                )
              } else if (checkLB) {
                qb.where(
                  'load_balancer_id IS NOT NULL',
                )
              }
            } else {
              qb.where(
                'COALESCE(load_balancer_id, firewall_id, switch_id) IS NOT NULL',
              )
            }
          }),
        );



        if (deviceByPodQueryDto.filter) {
          query.andWhere('dcim_device.name LIKE :pattern', {
            pattern: `%${deviceByPodQueryDto.filter}%`,
          });
        }
        if (deviceByPodQueryDto.site_id) {
          query.andWhere('dcim_device.site_id = :site_id', {
            site_id: deviceByPodQueryDto.site_id,
          });
        }
  
      const [items, totalItems] = await query.skip(skipCount)
        .take(deviceByPodQueryDto.per_page)
        .getManyAndCount();
  
      return new PaginationDto(
        deviceByPodQueryDto.page,
        deviceByPodQueryDto.per_page,
        totalItems,
        items,
      );
    }

    return new PaginationDto(
      deviceByPodQueryDto.page,
      deviceByPodQueryDto.per_page,
      0,
      [],
    );
  }

  async exportDeviceByPod(
    deviceByPodQueryDto: DeviceByPodQueryDto,
  ): Promise<Device[]> {
    const podDetail =  await this.podRepository.findOne({
      relations: {
        racks: true,
        locations: true,
      },
      where: { id: deviceByPodQueryDto.pod_id },
    });
  if (podDetail) {
    let listLocationIds = []
    let listRackIds = []
    if (podDetail.locations) {
      podDetail.locations.forEach((location, index) => {
        listLocationIds.push(location.id)
      })
      if (deviceByPodQueryDto.location_ids) {
        let queryLocationIds = deviceByPodQueryDto.location_ids.split(',');
        let arrlocationIds = queryLocationIds.map((item) => {
          return parseInt(item)
        })

        listLocationIds = listLocationIds.filter(value => arrlocationIds.includes(value));
      }
    } 
    if (podDetail.racks) {
      podDetail.racks.forEach((rack, index) => {
        listRackIds.push(rack.id)
      })
      if (deviceByPodQueryDto.rack_ids) {
        const queryRackIds = deviceByPodQueryDto.rack_ids.split(',');
        let arrRackIds = queryRackIds.map((item) => {
          return parseInt(item)
        })
        listRackIds = listRackIds.filter(value => arrRackIds.includes(value));
      }
    }
    const query = this.deviceRepository
      .createQueryBuilder('dcim_device')
      .leftJoinAndSelect('dcim_device.ip_address', 'ip_address')
      .leftJoinAndSelect('dcim_device.rack', 'dcim_rack')
      .leftJoinAndSelect('dcim_device.location', 'dcim_location')
      .where(
        new Brackets((qb) => {
          if (listLocationIds.length && listRackIds.length) {
            qb.where('dcim_device.location_id IN (:...location_id)', {
              location_id: listLocationIds,
            }).orWhere('dcim_device.rack_id IN (:...rack_id)', {
              rack_id: listRackIds,
            });
          } else if (listLocationIds.length) {
            qb.where('dcim_device.location_id IN (:...location_id)', {
              location_id: listLocationIds,
            });
          } else if (listRackIds.length) {
            qb.orWhere('dcim_device.rack_id IN (:...rack_id)', {
              rack_id: listRackIds,
            });
          } else {
            qb.where('dcim_device.rack_id IN (:...rack_id)', {
              rack_id: [0],
            }).andWhere('dcim_device.location_id IN (:...location_id)', {
              location_id: [0],
            });
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (deviceByPodQueryDto.device_types) {
            const listDeviceTypes = deviceByPodQueryDto.device_types.split(',');
            const checkLB = listDeviceTypes.includes('load_balancer_id')
            const checkSwitch = listDeviceTypes.includes('switch_id')
            const checkFW = listDeviceTypes.includes('firewall_id')
            if (checkLB && checkSwitch && checkFW) {
              qb.where(
                'COALESCE(load_balancer_id, firewall_id, switch_id) IS NOT NULL',
              )
            } else if (checkLB && checkSwitch) {
              qb.where(
                'COALESCE(load_balancer_id, switch_id) IS NOT NULL',
              )
            } else if (checkLB && checkFW) {
              qb.where(
                'COALESCE(load_balancer_id, firewall_id) IS NOT NULL',
              )
            } else if (checkSwitch && checkFW) {
              qb.where(
                'COALESCE(switch_id, firewall_id) IS NOT NULL',
              )
            } else if (checkFW) {
              qb.where(
                'firewall_id IS NOT NULL',
              )
            } else if (checkSwitch) {
              qb.where(
                'switch_id IS NOT NULL',
              )
            } else if (checkLB) {
              qb.where(
                'load_balancer_id IS NOT NULL',
              )
            }
          } else {
            qb.where(
              'COALESCE(load_balancer_id, firewall_id, switch_id) IS NOT NULL',
            )
          }
        }),
      );

    if (deviceByPodQueryDto.filter) {
      query.andWhere('dcim_device.name LIKE :pattern', {
        pattern: `%${deviceByPodQueryDto.filter}%`,
      });
    }
    if (deviceByPodQueryDto.site_id) {
      query.andWhere('dcim_device.site_id = :site_id', {
        site_id: deviceByPodQueryDto.site_id,
      });
    }

    return await query.getMany();
  }
}

  async getVpnAndStorageDeviceByPod(
    deviceByPodQueryDto: DeviceByPodQueryDto,
  ): Promise<PaginationDto<Device>> {
    const skipCount =
      (deviceByPodQueryDto.page - 1) * deviceByPodQueryDto.per_page;
      const podDetail =  await this.podRepository.findOne({
        relations: {
          racks: true,
          locations: true,
        },
        where: { id: deviceByPodQueryDto.pod_id },
      });
    if (podDetail) {
      let listLocationIds = []
      let listRackIds = []
      if (podDetail.locations) {
        podDetail.locations.forEach((location, index) => {
          listLocationIds.push(location.id)
        })
        if (deviceByPodQueryDto.location_ids) {
          let queryLocationIds = deviceByPodQueryDto.location_ids.split(',');
          let arrlocationIds = queryLocationIds.map((item) => {
            return parseInt(item)
          })

          listLocationIds = listLocationIds.filter(value => arrlocationIds.includes(value));
        }
      } 
      if (podDetail.racks) {
        podDetail.racks.forEach((rack, index) => {
          listRackIds.push(rack.id)
        })
        if (deviceByPodQueryDto.rack_ids) {
          const queryRackIds = deviceByPodQueryDto.rack_ids.split(',');
          let arrRackIds = queryRackIds.map((item) => {
            return parseInt(item)
          })
          listRackIds = listRackIds.filter(value => arrRackIds.includes(value));
        }
      }
      const query = this.deviceRepository
        .createQueryBuilder('dcim_device')
        .leftJoinAndSelect('dcim_device.ip_address', 'ip_address')
        .leftJoinAndSelect('dcim_device.rack', 'dcim_rack')
        .leftJoinAndSelect('dcim_device.location', 'dcim_location')
        .where(
          new Brackets((qb) => {
            if (listLocationIds.length && listRackIds.length) {
              qb.where('dcim_device.location_id IN (:...location_id)', {
                location_id: listLocationIds,
              }).orWhere('dcim_device.rack_id IN (:...rack_id)', {
                rack_id: listRackIds,
              });
            } else if (listLocationIds.length) {
              qb.where('dcim_device.location_id IN (:...location_id)', {
                location_id: listLocationIds,
              });
            } else if (listRackIds.length) {
              qb.where('dcim_device.rack_id IN (:...rack_id)', {
                rack_id: listRackIds,
              });
            } else {
              qb.where('dcim_device.rack_id IN (:...rack_id)', {
                rack_id: [0],
              }).andWhere('dcim_device.location_id IN (:...location_id)', {
                location_id: [0],
              });
            }
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            if (deviceByPodQueryDto.device_types) {
              const listDeviceTypes = deviceByPodQueryDto.device_types.split(',');
              const checkStorage = listDeviceTypes.includes('storage_id')
              const checkVPN = listDeviceTypes.includes('vpn_id')
              if (checkVPN && checkStorage) {
                qb.where(
                  'COALESCE(vpn_id, storage_id) IS NOT NULL',
                )
              } else if (checkVPN) {
                qb.where(
                  'vpn_id IS NOT NULL',
                )
              } else if (checkStorage) {
                qb.where(
                  'storage_id IS NOT NULL',
                )
              }
            } else {
              qb.where(
                'COALESCE(vpn_id, storage_id) IS NOT NULL',
              )
            }
          }),
        );

        if (deviceByPodQueryDto.filter) {
          query.andWhere('dcim_device.name LIKE :pattern', {
            pattern: `%${deviceByPodQueryDto.filter}%`,
          });
        }
        if (deviceByPodQueryDto.site_id) {
          query.andWhere('dcim_device.site_id = :site_id', {
            site_id: deviceByPodQueryDto.site_id,
          });
        }
  
      const [items, totalItems] = await query.skip(skipCount)
        .take(deviceByPodQueryDto.per_page)
        .getManyAndCount();
  
      return new PaginationDto(
        deviceByPodQueryDto.page,
        deviceByPodQueryDto.per_page,
        totalItems,
        items,
      );
    }

    return new PaginationDto(
      deviceByPodQueryDto.page,
      deviceByPodQueryDto.per_page,
      0,
      [],
    );
  }

  async exportVpnAndStorageDeviceByPod(
    deviceByPodQueryDto: DeviceByPodQueryDto,
  ): Promise<Device[]> {
    const podDetail =  await this.podRepository.findOne({
      relations: {
        racks: true,
        locations: true,
      },
      where: { id: deviceByPodQueryDto.pod_id },
    });
  if (podDetail) {
    let listLocationIds = []
    let listRackIds = []
    if (podDetail.locations) {
      podDetail.locations.forEach((location, index) => {
        listLocationIds.push(location.id)
      })
      if (deviceByPodQueryDto.location_ids) {
        let queryLocationIds = deviceByPodQueryDto.location_ids.split(',');
        let arrlocationIds = queryLocationIds.map((item) => {
          return parseInt(item)
        })

        listLocationIds = listLocationIds.filter(value => arrlocationIds.includes(value));
      }
    } 
    if (podDetail.racks) {
      podDetail.racks.forEach((rack, index) => {
        listRackIds.push(rack.id)
      })
      if (deviceByPodQueryDto.rack_ids) {
        const queryRackIds = deviceByPodQueryDto.rack_ids.split(',');
        let arrRackIds = queryRackIds.map((item) => {
          return parseInt(item)
        })
        listRackIds = listRackIds.filter(value => arrRackIds.includes(value));
      }
    }
    const query = this.deviceRepository
      .createQueryBuilder('dcim_device')
      .leftJoinAndSelect('dcim_device.ip_address', 'ip_address')
      .leftJoinAndSelect('dcim_device.rack', 'dcim_rack')
      .leftJoinAndSelect('dcim_device.location', 'dcim_location')
      .where(
        new Brackets((qb) => {
          if (listLocationIds.length && listRackIds.length) {
            qb.where('dcim_device.location_id IN (:...location_id)', {
              location_id: listLocationIds,
            }).orWhere('dcim_device.rack_id IN (:...rack_id)', {
              rack_id: listRackIds,
            });
          } else if (listLocationIds.length) {
            qb.where('dcim_device.location_id IN (:...location_id)', {
              location_id: listLocationIds,
            });
          } else if (listRackIds.length) {
            qb.orWhere('dcim_device.rack_id IN (:...rack_id)', {
              rack_id: listRackIds,
            });
          } else {
            qb.where('dcim_device.rack_id IN (:...rack_id)', {
              rack_id: [0],
            }).andWhere('dcim_device.location_id IN (:...location_id)', {
              location_id: [0],
            });
          }
        }),
      )
      .andWhere(
        new Brackets((qb) => {
          if (deviceByPodQueryDto.device_types) {
            const listDeviceTypes = deviceByPodQueryDto.device_types.split(',');
            const checkStorage = listDeviceTypes.includes('storage_id')
            const checkVPN = listDeviceTypes.includes('vpn_id')
            if (checkVPN && checkStorage) {
              qb.where(
                'COALESCE(vpn_id, storage_id) IS NOT NULL',
              )
            } else if (checkVPN) {
              qb.where(
                'vpn_id IS NOT NULL',
              )
            } else if (checkStorage) {
              qb.where(
                'storage_id IS NOT NULL',
              )
            }
          } else {
            qb.where(
              'COALESCE(vpn_id, storage_id) IS NOT NULL',
            )
          }
        }),
      );

      if (deviceByPodQueryDto.filter) {
        query.andWhere('dcim_device.name LIKE :pattern', {
          pattern: `%${deviceByPodQueryDto.filter}%`,
        });
      }
      if (deviceByPodQueryDto.site_id) {
        query.andWhere('dcim_device.site_id = :site_id', {
          site_id: deviceByPodQueryDto.site_id,
        });
      }

    return await query.getMany();
  }
}

  getDeviceType(device) {
    if (device.switch_id) {
      return 'SWITCH';
    } else if (device.firewall_id) {
      return 'FIREWALL';
    } else {
      return 'LOAD_BALANCER';
    }
  }

  getDeviceIP(device) {
    if (device.ip_address) {
      const ipAddressArr = device.ip_address.address.split('/');
      return ipAddressArr[0];
    }

    return null;
  }
}
