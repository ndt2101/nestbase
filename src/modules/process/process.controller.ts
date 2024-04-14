import { Controller, Res, Req, Param, Get, Post, Patch, Put, Query } from '@nestjs/common'
import { Response, Request } from 'express'

import { ProcessService } from './process.service'
import { BpmnExecutionService } from '../workflow/bpmn-execution.service'

@Controller('processes')
export class ProcessController
{
    constructor(
        private processService : ProcessService,
        private bpmnExecutionService : BpmnExecutionService
    ) {

    }

    @Get()
    async index(@Query() query, @Res() res : Response) : Promise<any> {
        const { data, meta } = await this.processService.listProcesses(query)

        return res.status(200).json({
            statusCode: 200,
            data: {
                success: true,
                code: 200,
                message: '',
                data: data,
                meta: meta,
            },
        })
    }

    @Post()
    async store(@Req() req : Request, @Res() res : Response) : Promise<any> {
        const requestData = req.body || {}
        const process = await this.processService.createProcess(requestData)

        return res.status(200).json({
            statusCode: 200,
            data: {
                success: true,
                code: 200,
                message: '',
                data: {
                    ...process,
                },
                meta: {},
            },
        })
    }

    @Get('/:id')
    async show(@Param('id') id : number, @Res() res : Response) : Promise<any> {
        const process = await this.processService.getProcess(Number(id))

        if (!process) {
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
                    ...process,
                },
                meta: {},
            },
        })
    }

    @Put('/:id')
    async update(@Param('id') id : number, @Req() req : Request, @Res() res : Response) : Promise<any> {
        let process = await this.processService.getProcess(Number(id))

        if (!process) {
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
        process = await this.processService.updateProcess(id, requestData)

        return res.status(200).json({
            statusCode: 200,
            data: {
                success: true,
                code: 200,
                message: '',
                data: {
                    ...process,
                },
                meta: {},
            },
        })
    }

    @Patch('/test')
    async testBpmn(@Res() res : Response) : Promise<any> {
        const testResult = await this.bpmnExecutionService.test()
        console.log(testResult)

        return res.status(200).json({
            statusCode: 200,
            data: {
                success: true,
                code: 200,
                message: '',
                data: {},
                meta: {},
            },
        })
    }

    @Post(':id/start')
    async start(@Param('id') id : number, @Req() req : Request, @Res() res : Response) : Promise<any> {
        let process = await this.processService.getProcess(Number(id))

        if (!process) {
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
        const startState = await this.bpmnExecutionService.start(id, requestData)

        console.log(startState)

        return res.status(200).send(startState)
    }
}
