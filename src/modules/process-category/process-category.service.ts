import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { ProcessCategoryRepository } from './process-category.repository'

@Injectable()
export class ProcessCategoryService
{
    constructor(
        @InjectRepository(ProcessCategoryRepository)
        private readonly processCategoryRepository : ProcessCategoryRepository
    ) {
        
    }

    async listProcessCategories(params : any) : Promise<any> {
        return this.processCategoryRepository.getList(params)
    }

    async getProcessCategory(id : number) : Promise<any> {
        return this.processCategoryRepository.findOneById(id)
    }

    async createProcessCategory(data : any) : Promise<any> {
        return this.processCategoryRepository.store(data)
    }

    async updateProcessCategory(id: number, data : any) : Promise<any> {
        return this.processCategoryRepository.update(id, data)
    }
}
