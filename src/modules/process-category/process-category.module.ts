import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TypeOrmExModule } from '@common/modules/typeorm-ex.module'
import { ProcessCategory } from 'src/database/entities/mariadb/process-category.entity'
import { ProcessCategoryController } from './process-category.controller'
import { ProcessCategoryService } from './process-category.service'
import { ProcessCategoryRepository } from './process-category.repository'

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProcessCategory,
        ]),
        TypeOrmExModule.forCustomRepository([
            ProcessCategoryRepository,
        ]),
    ],
    providers: [ ProcessCategoryService ],
    controllers: [ ProcessCategoryController ],
    exports: [ ProcessCategoryService ],
})
export class ProcessCategoryModule
{

}
