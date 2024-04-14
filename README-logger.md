# IT Brain Loggers

## Technology

Using log4js-node.
Visit [https://github.com/log4js-node/log4js-node](https://github.com/log4js-node/log4js-node) for more information.

## Folder Structure

- main.ts (applying HttpLogInterceptor as a Global Interceptor)
- src
    - interceptors
        - http-log.interceptor.ts (global interceptor)
    - logger
        - loggers
            - app-log.ts
        - services
            - log.service.ts (abstract class)
            - http-log.service.ts
            - app-log.service.ts

## Philosophy

The configuration and the construction of a logger is executed in a Log Service Class.
Each Log Service Class must extend the abstract class LogService (log.service.ts) and override 2 abstract methods:
    - getWorkingCategory(): Return the name of a category listed in the return value of getAppenders()
    - setLoggerContextAndMessage(): Assign a value to __message__ property (and set up context for __logger__ property if neccesary)
Each Log Service Class inherites 6 logging methods from the base Class which are __info()__, __warn()__, __error()__, __fatal()__, __debug()__ and __trace()__. Each of which is used to write logs at a level indicated by its name.

## Usage

HttpLogInterceptor runs automatically along each and every Http Request toward the system.
AppLog (app-log.ts) must be imported to be used.
View code to find out more.

Note that HttpLogInterceptor cannot intercept thrown built-in Exceptions.
