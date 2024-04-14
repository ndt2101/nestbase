import * as log4js from 'log4js'

import { final } from '../../common/decorators/class-inheritance.decorator'

import cipher from '../../common/utils/cipher.utils'

export default abstract class LogService
{
    protected appenders : any
    protected categories : any
    protected workingCategory : string
    protected message : string
    protected logger : any

    constructor() {
        this.setAppenders()
        this.setCategories()
        this.setWorkingCategory()
        this.setLogger()
    }

    protected getAppenders() : any {
        let elasticsearchUsername = encodeURIComponent(cipher.decrypt(process.env.ELASTICSEARCH_USERNAME))
        let elasticsearchPassword = encodeURIComponent(cipher.decrypt(process.env.ELASTICSEARCH_PASSWORD))
        let elasticsearchHost = process.env.ELASTICSEARCH_HOST
        let elasticsearchHostProtocol = elasticsearchHost.startsWith('https://') ? 'https' : 'http'
        elasticsearchHost = elasticsearchHost.startsWith('https://') ? elasticsearchHost.replace('https://', '') : elasticsearchHost.replace('http://', '')
        let elasticsearchUrl = `${elasticsearchHostProtocol}://${elasticsearchUsername}:${elasticsearchPassword}@${elasticsearchHost}/_bulk`

        return {
            console: {
                type: 'console',
            },
            ldfIncomingRequest: {
                type: 'dateFile',
                filename: process.cwd() + '/logs/incoming-requests/daily.log',
                fileNameSep: '.',
                keepFileExt: true,
                pattern: 'yyyy-MM-dd',
                alwaysIncludePattern: true,
            },
            esIncomingRequest: {
                type: '@log4js-node/logstash-http',
                url: elasticsearchUrl,
                // logChannel: 'http_incoming_requests', // is optional & is not required in an Index Document
                application: 'it_brain_incoming_requests', // is optional & will be applied as the index name; can be applied to the URL such as (host)/(index)/_bulk
                timeout: 1000 * 60,
            },
            ldfApp: {
                type: 'dateFile',
                filename: process.cwd() + '/logs/app/daily.log',
                fileNameSep: '.',
                keepFileExt: true,
                pattern: 'yyyy-MM-dd',
                alwaysIncludePattern: true,
            },
            esApp: {
                type: '@log4js-node/logstash-http',
                url: elasticsearchUrl,
                // logChannel: 'app', // is optional & is not required in an Index Document
                application: 'it_brain_app', // is optional & will be applied as the index name; can be applied to the URL such as (host)/(index)/_bulk
                timeout: 1000 * 60,
            },
        }
    }

    protected getCategories() : any {
        return {
            default: {
                appenders: [
                    'console',
                ],
                level: 'all',
            },
            incomingRequest: {
                appenders: [
                    'console',
                    'ldfIncomingRequest',
                    'esIncomingRequest',
                ],
                level: 'all',
            },
            app: {
                appenders: [
                    'console',
                    'ldfApp',
                    'esApp',
                ],
                level: 'all',
            },
        }
    }

    protected abstract getWorkingCategory() : any

    protected abstract setLoggerContextAndMessage(data : any) : any

    protected setAppenders() : void {
        this.appenders = this.getAppenders()
    }

    protected setCategories() : void {
        this.categories = this.getCategories()
    }

    protected setWorkingCategory() : void {
        this.workingCategory = this.getWorkingCategory()
    }

    @final
    protected setLogger() : void {
        log4js.configure({
            appenders: this.appenders,
            categories: this.categories,
        })
        this.logger = log4js.getLogger(this.workingCategory)
    }

    @final
    public info(data : any) : void
    {
        this.setLoggerContextAndMessage(data)
        this.logger.info(this.message)
    }

    @final
    public warn(data : any) : void
    {
        this.setLoggerContextAndMessage(data)
        this.logger.warn(this.message)
    }

    @final
    public error(data : any) : void
    {
        this.setLoggerContextAndMessage(data)
        this.logger.error(this.message)
    }

    @final
    public fatal(data : any) : void
    {
        this.setLoggerContextAndMessage(data)
        this.logger.fatal(this.message)
    }

    @final
    public debug(data : any) : void
    {
        this.setLoggerContextAndMessage(data)
        this.logger.debug(this.message)
    }

    @final
    public trace(data : any) : void
    {
        this.setLoggerContextAndMessage(data)
        this.logger.trace(this.message)
    }
}