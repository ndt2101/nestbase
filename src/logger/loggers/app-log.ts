import AppLogService from '../services/app-log.service'

export default class AppLog
{
    public static getLogger() : AppLogService {
        return new AppLogService()
    }

    public static info(data : any) : void {
        const logger = AppLog.getLogger()

        return logger.info(data)
    }

    public static warn(data : any) : void {
        const logger = AppLog.getLogger()

        return logger.warn(data)
    }

    public static error(data : any) : void {
        const logger = AppLog.getLogger()

        return logger.error(data)
    }

    public static fatal(data : any) : void {
        const logger = AppLog.getLogger()

        return logger.fatal(data)
    }

    public static debug(data : any) : void {
        const logger = AppLog.getLogger()

        return logger.debug(data)
    }

    public static trace(data : any) : void {
        const logger = AppLog.getLogger()

        return logger.trace(data)
    }
}
