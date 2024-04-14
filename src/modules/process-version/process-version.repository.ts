import { Repository, Not } from 'typeorm'
import { remove as removeAccents } from 'remove-accents'

import { ProcessVersion } from 'src/database/entities/mariadb/process-version.entity'
import { CustomRepository } from '@common/decorators/typeorm-ex.decorator'

@CustomRepository(ProcessVersion)
export class ProcessVersionRepository extends Repository<ProcessVersion>
{
    async store(data : any) : Promise<any> {
        const firstVersionNumber = await this.minimum('number', {
            process_id: data.id,
        })
        const firstVersion = await this.findOneBy({
            process_id: data.id,
            number: firstVersionNumber,
        })
        const latestVersionNumber = await this.maximum('number', {
            process_id: data.id,
        })
        const newNumber = !!latestVersionNumber ? (Number(latestVersionNumber) + 1) : 1
        const versionCode = removeAccents(firstVersion && firstVersion.name || data.name)
            .toLowerCase()
            .replace(/\s+/gm, '-')
            .substring(0, 50) 
            + ('-' + newNumber)
        const processVersion = await this.save({
            process_id: data.id,
            process_category_id: data.process_category_id,
            number: newNumber,
            code: versionCode,
            name: data.name,
            description: data.description,
            bpmn: data.bpmn,
        })
        await this.deactivateOthers(processVersion.id)

        return processVersion
    }

    private async deactivateOthers(id : number|string) : Promise<any> {
        const processVersion = await this.findOneById(id)

        if (!processVersion) {
            return
        }

        await this.update({
            process_id: processVersion.process_id,
            id: Not(processVersion.id),
        }, {
            status: 'INACTIVE',
        })
    }
}
