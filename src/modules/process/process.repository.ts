import { Repository, Like } from 'typeorm'

import { Process } from 'src/database/entities/mariadb/process.entity'
import { CustomRepository } from '@common/decorators/typeorm-ex.decorator'

@CustomRepository(Process)
export class ProcessRepository extends Repository<Process>
{
    async getPaginatedList(params : any) : Promise<any> {
        let perPage = Number(params.per_page || params.limit || 10)
        let page = Number(params.page || 1)

        if (!(perPage >= 10 && perPage <= 200)) {
            perPage = 10
        }

        if (page <= 0) {
            page = 1
        }

        const [ list, count ] = await this.findAndCount({
            where: {
                name: Like(`%${params.name || ''}%`),
                process_category_id: params.process_category_id || undefined,
                processVersions: {
                    status: 'ACTIVE',
                },
            },
            take: perPage,
            skip: perPage * (page - 1), // Acting like the OFFSET options,
            order: {
                id: 'DESC',
            },
        })

        return {
            data: list,
            meta: {
                page: page,
                per_page: perPage,
                total: count,
                total_pages: Math.ceil(count / perPage),
            },
        }
    }

    async store(data : any) : Promise<any> {
        const insertData = {
            name: data.name,
            process_category_id: data.process_category_id,
            description: data.description,
        }
        const process = await this.save(insertData)

        return process
    }

    async update(id : number, data : any) : Promise<any> {
        let process = await this.findOneById(id)

        for (const key of Object.keys(data)) {
            process[key] = data[key]
        }

        process = await this.save(process)

        return process
    }
}
