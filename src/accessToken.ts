import { OauthClientConfig } from './createOauthClient'
import { StorageModule } from './createStorageModule'
import { Logger } from './logger'
import { EventPublishFn } from './createEventModule'
import { validateJwt, parseJwt, TokenPart } from './jwt'

export const getAccessToken = (
  oauthClientConfig: OauthClientConfig,
  storageModule: StorageModule,
  logger: Logger,
  publish: EventPublishFn
): string | null => {
  logger.log('Get access token')
  let accessToken = null
  try {
    accessToken = storageModule.get('accessToken')
  } catch {}
  if (!accessToken) {
    logger.log('No token in storage')
    return null
  }
  try {
    validateJwt(accessToken, oauthClientConfig)
  } catch {
    publish('tokenUnloaded')
    return null
  }
  logger.log('Valid token in storage')
  return accessToken
}

export const getAccessTokenClaims = (
  oauthClientConfig: OauthClientConfig,
  storageModule: StorageModule,
  logger: Logger,
  publish: EventPublishFn
): TokenPart | null => {
  logger.log('Get access token claims')
  const accessToken = getAccessToken(
    oauthClientConfig,
    storageModule,
    logger,
    publish
  )
  if (!accessToken) {
    return null
  }
  const { claims } = parseJwt(accessToken)
  return claims
}

export const removeAccessToken = (
  storageModule: StorageModule,
  logger: Logger,
  publish: EventPublishFn
): void => {
  logger.log('Remove access token')
  try {
    storageModule.remove('accessToken')
    publish('tokenUnloaded')
  } catch {}
}
