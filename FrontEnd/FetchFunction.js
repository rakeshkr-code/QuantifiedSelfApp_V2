import store from './vuex/index.js'
async function FetchFunction({ url, init_obj, authRequired }) {
  /**
   * url: url to send request to
   * init_object: Meta data about request
   * authRequired: Status that authentication is required or not
   */
  if (! url) {
    throw Error('Url required')
  }

  if (! init_obj) {
    init_obj = {}
  }

  if (authRequired === undefined) {
    authRequired = false
  }

  if (authRequired === true) {
    if (init_obj.headers === undefined) {
      init_obj.headers = {
        'Content-Type': 'application/json',
        'Authentication-token': store.getters.token,
      }
    } else {
      init_obj.headers['Authentication-token'] = store.getters.token
      init_obj.headers['Content-Type'] = 'application/json'
    }
    if (! init_obj.mode) {
        init_obj.mode = 'cors'
    } else {
        init_obj['mode'] = 'cors'
    }
  }
  console.log(init_obj)
  const response = await fetch(url, init_obj).catch(() => {
    throw Error('Network Error, Not able to fetch URL !')
  })
  if (response) {
    if (response.ok) {
      const data = await response.json().catch(() => {
        throw Error('Response is not JSON Serializable, Unexpected Response')
      })
      if (data) {
        return data     // This actually contains and returns 
      }
    } else {
      throw Error(response.statusText)
    }
  }
}

export default FetchFunction