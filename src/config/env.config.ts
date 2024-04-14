import { env } from 'custom-env'

var envMode = process.env.NODE_ENV || 'local'

if (![ 'development', 'dev', 'production', 'prod', 'staging', 'test', 'local' ].includes(envMode)) {
  envMode = 'local'
}

export function setEnvVar() {
    env(envMode)
}

export function getEnvFile() {
    return `.env.${envMode}`
}
