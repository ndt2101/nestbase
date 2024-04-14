import LogService from './log.service'

export default class AppLogService extends LogService
{
    constructor() {
        super()
    }

    protected getWorkingCategory() : any {
        return 'app'
    }

    protected setLoggerContextAndMessage(data : any) : any {
        this.message = data
    }
}
