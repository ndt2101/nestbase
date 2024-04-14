import { Controller, Get, Param, Query } from '@nestjs/common';
import { LoadBalancerService } from './load-balancer.service';
import { Loadbalancer } from '../../../database/entities/postgre/Loadbalancer.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { LoadbalancerQueryDto } from './dto/loadbalancerQuery.dto';

@Controller('loadbalancers')
export class LoadBalancerController {
  constructor(private readonly loadBalancerService: LoadBalancerService) {}

  @Get('/')
  findAll(
    @Query() loadbalancerQueryDto: LoadbalancerQueryDto,
  ): Promise<PaginationDto<Loadbalancer>> {
    return this.loadBalancerService.findAll(loadbalancerQueryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadBalancerService.show(+id);
  }
}
