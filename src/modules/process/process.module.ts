import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeOrmExModule } from '@common/modules/typeorm-ex.module'
import { Process } from 'src/database/entities/mariadb/process.entity'
import { ProcessVersion } from 'src/database/entities/mariadb/process-version.entity'
import { ProcessService } from './process.service'
import { ProcessController } from './process.controller'
import { ProcessRepository } from './process.repository'
import { ProcessVersionRepository } from '../process-version/process-version.repository'
import { BpmnExecutionService } from '../workflow/bpmn-execution.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Process, ProcessVersion,
        ]),
        TypeOrmExModule.forCustomRepository([
            ProcessRepository, ProcessVersionRepository,
        ]),
    ],
    providers: [
        ProcessService,
        BpmnExecutionService,
    ],
    controllers: [ ProcessController ],
    exports: [ ProcessService ],
})
export class ProcessModule
{

}
