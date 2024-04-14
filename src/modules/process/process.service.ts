import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
// import BpmnModdle from 'bpmn-moddle'
const BpmnModdle = require('bpmn-moddle')

import { ProcessRepository } from './process.repository'
import { ProcessEnum } from './process.enum'
import { ProcessVersionRepository } from '../process-version/process-version.repository'

@Injectable()
export class ProcessService
{
    constructor(
        @InjectRepository(ProcessRepository)
        private readonly processRepository : ProcessRepository,
        @InjectRepository(ProcessVersionRepository)
        private readonly processVersionRepository : ProcessVersionRepository
    ) {

    }

    async listProcesses(params : any) : Promise<any> {
        return await this.processRepository.getPaginatedList(params)
    }

    async createProcess(data : any) : Promise<any> {
        return await this.processRepository.store(data)
    }

    async getProcess(id : number) : Promise<any> {
        return await this.processRepository.findOneById(id)
    }

    async updateProcess(id : number, data : any) : Promise<any> {
        const process = await this.processRepository.update(id, data)
        await this.processVersionRepository.store(process)

        return process
    }

    async getDefinition(id : number) : Promise<any> {
        const process = await this.processRepository.findOneById(id)

        if (!process) return null

        const moddle = new BpmnModdle()

        return await moddle.fromXML(process.bpmn)
    }

    async getStartEvents(id : number) : Promise<any> {
        const res = []
        const definition = await this.getDefinition(id)
        const elementsById = definition && definition.elementsById

        if (!elementsById) return null

        for (const key of Object.keys(elementsById)) {
            if (elementsById[key].$type === ProcessEnum.START_EVENT_TYPE) {
                res.push(elementsById[key])
            }
        }

        return res
    }

    async getElementDefinition(id : number, elementId : string) : Promise<any> {
        const definition = await this.getDefinition(id)
        const elementsById = definition && definition.elementsById

        if (!elementsById) return null

        for (const key of Object.keys(elementsById)) {
            if (key === elementId) return elementsById[key]
        }

        return null
    }

    async getNextElementDefinitions(id : number, elementId : string) : Promise<any> {
        const definition = await this.getDefinition(id)

        if (await this.getElementDefinition(id, elementId) === null) return null

        const references = definition && definition.references

        if (!references) return []

        const outgoingFlows = references.filter(el => el.element.property === ProcessEnum.OUTGOING_TYPE && el.element.id === elementId)
        const outgoingFlowIds = outgoingFlows.map(el => el.id)
        const incomingFlows = references.filter(el => el.element.property === ProcessEnum.INCOMING_TYPE && outgoingFlowIds.includes(el.id))

        return incomingFlows.map(el => el.element)
    }

    async getNextFlowDefinitions(id : number, elementId : string) : Promise<any> {
        const definition = await this.getDefinition(id)

        if (await this.getElementDefinition(id, elementId) === null) return null

        const references = definition && definition.references

        if (!references) return []

        const outgoingFlows = references.filter(el => el.element.property === ProcessEnum.OUTGOING_TYPE && el.element.id === elementId)
        const outgoingFlowIds = outgoingFlows.map(el => el.id)
        const incomingFlows = references.filter(el => el.element.property === ProcessEnum.INCOMING_TYPE && outgoingFlowIds.includes(el.id))

        return incomingFlows
    }
}
