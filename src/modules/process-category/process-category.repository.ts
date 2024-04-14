import { Repository, Like } from 'typeorm'

import { ProcessCategory } from 'src/database/entities/mariadb/process-category.entity'
import { CustomRepository } from '@common/decorators/typeorm-ex.decorator'

@CustomRepository(ProcessCategory)
export class ProcessCategoryRepository extends Repository<ProcessCategory>
{
    async getList(params : any) : Promise<any> {
        return this.findBy({
            name: Like(`%${params.name || ''}%`)
        })
    }

    async getPaginatedList(params : any) : Promise<any> {

    }

    async store(data : any) : Promise<any> {
        return await this.save({
            name: data.name,
        })
    }

    async update(id : number, data : any) : Promise<any> {
        let processCategory = await this.findOneById(id)
        processCategory.name = data.name
        processCategory.status = data.status || 'ACTIVE'
        processCategory = await this.save(processCategory)

        return processCategory
    }
}
