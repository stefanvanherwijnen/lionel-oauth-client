import {
  getAccessToken,
  getAccessTokenExpires,
  removeAccessToken
} from '../../src/accessToken'
import createStorageModule from '../../src/createStorageModule'
import createLogger from '../../src/logger'
import { oauthConfig } from './test-config'
import accessTokenMock from './mocks/accessTokenMock.json'
import {
  createTokenValidTimeMock,
  createTokenExpiredTimeOutsideLeewayMock
} from './mocks/timeMocks'
import { vi } from 'vitest'

describe('getAccessToken', (): void => {
  describe('when token is not expired', (): void => {
    beforeAll(createTokenValidTimeMock(accessTokenMock.decodedPayload))
    it('should get an access token if there is one in storage', async (): Promise<void> => {
      const storageModule = createStorageModule(oauthConfig)
      storageModule.set('accessToken', accessTokenMock.encoded)
      storageModule.set(
        'accessTokenExpires',
        accessTokenMock.decodedPayload.exp.toString()
      )
      const accessToken = getAccessToken(
        storageModule,
        createLogger(oauthConfig)
      )
      storageModule.remove('accessToken')
      storageModule.remove('accessTokenExpires')
      expect(accessToken).toBe(accessTokenMock.encoded)
    })
    it('should not throw error if access token is not in storage', async (): Promise<void> => {
      const storageModule = createStorageModule(oauthConfig)
      const accessToken = getAccessToken(
        storageModule,
        createLogger(oauthConfig)
      )
      expect(accessToken).toBe(null)
    })
    afterAll(() => {
      vi.resetAllMocks()
    })
  })
  describe('after token is expired, outside of leeway', (): void => {
    beforeAll(
      createTokenExpiredTimeOutsideLeewayMock(
        accessTokenMock.decodedPayload,
        oauthConfig
      )
    )
    it('should not get token if an expired token is in storage', async (): Promise<void> => {
      const storageModule = createStorageModule(oauthConfig)
      storageModule.set('accessToken', accessTokenMock.encoded)
      storageModule.set(
        'accessTokenExpires',
        accessTokenMock.decodedPayload.exp.toString()
      )
      const accessToken = getAccessToken(
        storageModule,
        createLogger(oauthConfig)
      )
      expect(accessToken).toBe(null)
    })
    afterAll(() => {
      vi.resetAllMocks()
    })
  })
})
describe('getAccessTokenExpires', (): void => {
  it('should return expires timestamp as a number', async (): Promise<void> => {
    const storageModule = createStorageModule(oauthConfig)
    const logger = createLogger(oauthConfig)
    storageModule.set('accessToken', accessTokenMock.encoded)
    storageModule.set(
      'accessTokenExpires',
      accessTokenMock.decodedPayload.exp.toString()
    )
    const expires = getAccessTokenExpires(storageModule)
    expect(expires).toBe(accessTokenMock.decodedPayload.exp)
    removeAccessToken(storageModule, logger)
  })
  it('should get 0 if not set in storage', async (): Promise<void> => {
    const storageModule = createStorageModule(oauthConfig)
    const expires = getAccessTokenExpires(storageModule)
    expect(expires).toBe(0)
  })
})
describe('removeAccessToken', (): void => {
  it('should remove access token from storage', async (): Promise<void> => {
    const storageModule = createStorageModule(oauthConfig)
    const logger = createLogger(oauthConfig)
    storageModule.set('accessToken', accessTokenMock.encoded)
    storageModule.set('accessTokenExpires', (Date.now() + 1000).toString())
    let accessToken = getAccessToken(storageModule, logger)
    // expect(accessToken).toBe(accessTokenMock.encoded)
    removeAccessToken(storageModule, logger)
    accessToken = getAccessToken(storageModule, logger)
    expect(accessToken).toBe(null)
  })
})
