import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable, tap } from 'rxjs'
import * as moment from 'moment'

import HttpLogService from '../logger/services/http-log.service'

@Injectable()
export default class HttpLoggerInterceptor implements NestInterceptor
{
    readonly HIDDEN_FIELD_INDICATORS : Array<string> = [
        'pass',
        'key',
        'token',
    ]

    protected httpLogService : HttpLogService

    constructor(private reflector : Reflector) {
        this.httpLogService = new HttpLogService()
    }

    intercept(context: ExecutionContext, next: CallHandler) : Observable<any> {
        const executionStartTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        const className = context.getClass().name
        const functionName = context.getHandler().name
        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest()
        const response = httpContext.getResponse()

        return next.handle().pipe(tap(responseContent => {
            const executionEndTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS')

            let requestContent = JSON.parse(JSON.stringify(request.method.toUpperCase() == 'GET' ? (request.query || request.params || {}) : (request.body || {})))
            let responseCode = response.statusCode || 200

            for (let key of Object.keys(requestContent)) {
                if (!!this.HIDDEN_FIELD_INDICATORS.filter(element => key.includes(element.toLowerCase())).length) {
                    delete requestContent[key]
                }
            }

            const contextDescription = {
                application_code: process.env.APP_CODE || '',
                service_code: [ process.env.APP_CODE || '' + 'API', 'INCOMING-REQUEST', className.toLowerCase().replace('controller', '') ]
                    .map(element => element.toUpperCase())
                    .filter(element => !!element)
                    .join('.'),
                action_name: className + '@' + functionName,
                method: request.method,
                url: request.protocol + '://' + request.get('Host') + request.originalUrl,
                ip_port_current_node: request.get('Host'),
                ip_port_parent_node: request.ip || request.connection.remoteAddress || request.headers['cf-connecting-ip'] 
                    || request.headers['x-real-ip'] || request.headers['x-forwarded-for'] || '',
                account: '',
                agent: request.headers['user-agent'] || '',
                start_time: executionStartTime,
                end_time: executionEndTime,
                duration: Number((moment(executionEndTime).diff(moment(executionStartTime), 'milliseconds') / 1000).toFixed(3)),
                status_code: responseCode,
            }
            const contextAsText = this.buildOneLineLog(contextDescription)
            const logData = {
                context: contextDescription,
                message: {
                    context: contextAsText,
                    request_content: requestContent,
                    response_content: responseContent,
                    response_message: responseContent && responseContent.message || '',
                },
            }

            if (responseCode < 200) {
                this.httpLogService.warn(logData)
            } else if (responseCode >= 200 && responseCode <= 299) {
                this.httpLogService.info(logData)
            } else if (responseCode >= 300 && responseCode <= 499) {
                this.httpLogService.warn(logData)
            } else {
                this.httpLogService.error(logData)
            }
        }))
    }

    private buildOneLineLog(data: Object) : string {
        return Object.values(data)
            .map(element => {
                let elementDataType = typeof element

                if ([ 'string', 'number' ].includes(elementDataType)) {
                    return element
                } else if ([ 'boolean', 'undefined' ].includes(elementDataType)) {
                    return String(element)
                } else {
                    try {
                        return JSON.stringify(element)
                    } catch (err) {
                        return '[object]'
                    }
                }
            })
            .join(' | ')
    }
}
