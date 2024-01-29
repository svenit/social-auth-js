import Promise from './promise.js'
import { objectExtend, isFunction} from './utils.js'
import defaultOptions from './options.js'
import StorageFactory from './storage.js'
import OAuth1 from './oauth/oauth1.js'
import OAuth2 from './oauth/oauth2.js'

export default class SocialAuth {
  constructor($http, overrideOptions) {
    let options = objectExtend({}, defaultOptions)
    options = objectExtend(options, overrideOptions)
    let storage = StorageFactory(options)

    Object.defineProperties(this, {
      $http: {
        get() {
          return $http
        }
      },

      options: {
        get() {
          return options
        }
      },

      storage: {
        get() {
          return storage
        }
      },

      tokenName: {
        get() {
          if (this.options.tokenPrefix) {
            return [this.options.tokenPrefix, this.options.tokenName].join('_')
          } else {
            return this.options.tokenName
          }
        }
      }
    })

    // Setup request interceptors
    if (this.options.bindRequestInterceptor && isFunction(this.options.bindRequestInterceptor) &&
        this.options.bindResponseInterceptor && isFunction(this.options.bindResponseInterceptor)) {

      this.options.bindRequestInterceptor.call(this, this)
      this.options.bindResponseInterceptor.call(this, this)
    } else {
      throw new Error('Both request and response interceptors must be functions')
    }
  }

  /**
   * Get token if user is authenticated
   * @return {String} Authentication token
   */
  getToken() {
    return this.storage.getItem(this.tokenName)
  }

  /**
   * Authenticate user using authentication provider
   *
   * @param  {String} provider       Provider name
   * @param  {Object} userData       User data
   * @param  {Object} requestOptions Request options
   * @return {Promise}               Request promise
   */
  authenticate(provider, userData, requestOptions) {
    return new Promise((resolve, reject) => {
      const providerConfig = this.options.providers[provider]
      if (!providerConfig) {
        return reject(new Error('Unknown provider'))
      }

      let providerInstance;
      switch (providerConfig.oauthType) {
        case '1.0':
          providerInstance = new OAuth1(this.$http, this.storage, providerConfig, this.options)
          break
        case '2.0':
          providerInstance = new OAuth2(this.$http, this.storage, providerConfig, this.options)
          break
        default:
          return reject(new Error('Invalid OAuth type'))
          break
      }

      return providerInstance.init(userData).then((response) => {
        return resolve(response)

      }).catch(err => reject(err))
    })
  }

}
