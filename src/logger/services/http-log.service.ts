import LogService from './log.service'

export default class HttpLogService extends LogService
{
    constructor() {
        super()
    }

    protected getWorkingCategory() : any {
        return 'incomingRequest'
    }

    protected setLoggerContextAndMessage(data : any) : any {
        let context = data.context || {}
        let message = data.message || ''

        for (let contextKey of Object.keys(context)) {
            this.logger.addContext(contextKey, context[contextKey])
        }

        this.message = message
    }
}
