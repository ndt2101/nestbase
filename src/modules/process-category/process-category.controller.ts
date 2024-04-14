import { Controller, Res, Req, Param, Get, Post, Put, Query } from '@nestjs/common'
import { Response, Request, query } from 'express'

import { ProcessCategoryService } from './process-category.service'

@Controller('process-categories')
export class ProcessCategoryController
{
    constructor(
        private processCategoryService : ProcessCategoryService
    ) {

    }

    @Get()
    async index(@Query() query, @Res() res : Response) : Promise<any> {
        const list = await this.processCategoryService.listProcessCategories(query)

        return res.status(200).json({
            statusCode: 200,
            data: {
                success: true,
                code: 200,
                message: '',
                data: list,
                meta: {},
            },
        })
    }

    @Post()
    async store(@Req() req : Request, @Res() res : Response) : Promise<any> {
        const { name } = req.body || {}
        const processCategory = await this.processCategoryService.createProcessCategory({
            name: name,
        })

        return res.status(200).json({
            statusCode: 200,
            data: {
                success: true,
                code: 200,
                message: '',
                data: {
                    ...processCategory,
                },
                meta: {},
            },
        })
    }

    @Get('/:id')
    async show(@Param('id') id : number, @Res() res : Response) : Promise<any> {
        const processCategory = await this.processCategoryService.getProcessCategory(Number(id))

        if (!processCategory) {
            return res.status(404).json({
                statusCode: 404,
                data: {
                    success: true,
                    code: 404,
                    message: '',
                    data: null,
                    meta: {},
                },
            })    
        }

        return res.status(200).json({
            statusCode: 200,
            data: {
                success: true,
                code: 200,
                message: '',
                data: {
                    ...processCategory,
                },
                meta: {},
            },
        })
    }

    @Put('/:id')
    async update(@Param('id') id : number, @Req() req : Request, @Res() res : Response) : Promise<any> {
        let processCategory = await this.processCategoryService.getProcessCategory(Number(id))

        if (!processCategory) {
            return res.status(404).json({
                statusCode: 404,
                data: {
                    success: true,
                    code: 404,
                    message: '',
                    data: null,
                    meta: {},
                },
            })
        }

        const requestData = req.body || {}
        processCategory = await this.processCategoryService.updateProcessCategory(Number(id), requestData)

        return res.status(200).json({
            statusCode: 200,
            data: {
                success: true,
                code: 200,
                message: '',
                data: {
                    ...processCategory,
                },
                meta: {},
            },
        })
    }
}
