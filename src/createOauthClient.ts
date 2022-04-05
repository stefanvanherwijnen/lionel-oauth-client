import createLogger, { Logger } from './logger'
import { getAccessToken, removeAccessToken } from './accessToken'
import { StorageModuleType, createStorageModule } from './createStorageModule'
import { EventSubscribeFn, createEventModule } from './createEventModule'
import handleCallback from './handleCallback'
import { MetaData } from './metaData'
import signIn from './signIn'

const responseModes = <const>['fragment', 'query']
export type ResponseMode = typeof responseModes[number]

const displays = <const>['page', 'popup', 'touch', 'wap']
export type Display = typeof displays[number]

const prompts = <const>['none', 'login', 'consent', 'select_account']
export type Prompt = typeof prompts[number]

export interface OauthClientConfig {
  issuer: string
  clientId: string
  redirectUri: string
  scopes?: string[]
  authorizationEndpoint?: string
  tokenEndpoint?: string
  tokenStorage?: StorageModuleType
  tokenLeewaySeconds?: number
  authenticationMaxAgeSeconds?: number
  responseMode?: ResponseMode
  metaData?: MetaData
  useNonce?: boolean
  useMetaData?: boolean
  display?: Display
  prompt?: Prompt
  uiLocales?: string[]
  acrValues?: string[]
  debug?: boolean
}

export interface OauthClient {
  signIn: () => Promise<void>
  handleCallback: () => void
  getAccessToken: () => string | null
  removeAccessToken: () => void
  getConfig: () => OauthClientConfig
  logger: Logger
  subscribe: EventSubscribeFn
  unsubscribe: EventSubscribeFn
}

const requiredOauthClientAttributes = <const>[
  'issuer',
  'clientId',
  'redirectUri'
]

export const getOauthClientConfig = (
  configArg: OauthClientConfig
): OauthClientConfig => {
  const missingAttribute = requiredOauthClientAttributes.find(
    requiredAttribute => !configArg[requiredAttribute]
  )
  if (missingAttribute) {
    throw Error(`Required attribute ${missingAttribute} missing in config`)
  }

  return {
    scopes: [''],
    authorizationEndpoint: '/authorize',
    tokenEndpoint: '/token',
    debug: false,
    tokenLeewaySeconds: 60,
    ...configArg
  }
}

export default (configArg: OauthClientConfig): OauthClient => {
  const config = getOauthClientConfig(configArg)
  const storageModule = createStorageModule(config)
  const { subscribe, unsubscribe, publish } = createEventModule()
  const logger = createLogger(config)

  logger.log('Create oAuthClient')
  logger.log({ config })

  return {
    signIn: async (): Promise<void> =>
      signIn(config, storageModule, null, logger),
    handleCallback: async (): Promise<void> =>
      handleCallback(config, storageModule, null, logger, publish),
    getAccessToken: (): string | null =>
      getAccessToken(config, storageModule, logger),
    removeAccessToken: (): void => removeAccessToken(storageModule, logger),
    getConfig: (): OauthClientConfig => config,
    logger,
    subscribe,
    unsubscribe
  }
}
