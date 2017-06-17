import Request from 'request'

import { parseVideo, parseComment, parseUser, parseEntity, parseCategory } from './responseParser.js'

/**
  * @desc - set defaults for Vimeo API calls
*/
let VimeoRequest = Request.defaults({
  baseUrl: 'https://api.vimeo.com/',
  auth: { bearer: localStorage.getItem('accessToken') },
  json: true
})

/**
  * @desc - requests for access token and saves user and access token to localStorage
  * @param string $code - code to exchange for access_token
  * @param string $authHeader - header constructed with base64(clientId:clientSecret)
  * @param string $redirectUrl - url to redirect on success
*/
export const login = (code, authHeader, redirectUrl) => {
  return new Promise((resolve, reject) => {
    Request({
      url: 'https://api.vimeo.com/oauth/access_token',
      method: 'POST',
      headers: authHeader,
      body: {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': redirectUrl
      },
      json: true
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        localStorage.setItem('user', JSON.stringify({
          uri: body.user.uri,
          name: body.user.name,
          picture: (!body.user.pictures) ? null : body.user.pictures[body.user.pictures.length - 1].link
        }))
        localStorage.setItem('accessToken', body.access_token)

        // updates default access token when making API calls to Vimeo
        VimeoRequest = VimeoRequest.defaults({
          auth: { bearer: body.access_token }
        })

        resolve()
      }

      reject()
    })
  })
}

/**
  * @desc - revokes access token
*/
export const logout = () => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: '/tokens',
      method: 'DELETE'
    }, (error, response, body) => {
      if (response.statusCode === 204) {
        resolve()
      }

      reject()
    })
  })
}

/**
  * @desc - get videos in a user's feed
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $qs - extra options to be passed along as query strings
  * @resolve - object with paging information and parsed video data
*/
export const getFeeds = (endpoint, qs={}) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET',
      qs: qs
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve({
          paging: {
            next: (body.paging.next === null) ? null : body.page + 1
          },
          videos: body.data.map((feed) => {
            return parseVideo(feed.clip)
          })
        })
      }

      reject()
    })
  })
} 

/**
  * @desc - get entities (i.e. Channels, Groups, Albums, etc)
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $qs - extra options to be passed along as query strings
  * @resolve - object with paging information and parsed entity data
*/
export const getListings = (endpoint, type, qs={}) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET',
      qs: qs
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve({
          paging: {
            next: (body.paging.next === null) ? null : body.page + 1
          },
          [type]: body.data.map((item) => {
            return parseEntity(item)
          })
        })
      }

      reject()
    })
  })
}

/**
  * @desc - get channels
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $qs - extra options to be passed along as query strings
  * @return - promise from getListings()
*/
export const getChannels = (endpoint, qs={}) => {
  return getListings(endpoint, 'channels', qs)
}

/**
  * @desc - get groups
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $qs - extra options to be passed along as query strings
  * @return - promise from getListings()
*/
export const getGroups = (endpoint, qs={}) => {
  return getListings(endpoint, 'groups', qs)
}

/**
  * @desc - get entity (i.e. Channels, Groups, Albums, etc)
  * @param string $endpoint - request endpoint for Vimeo's API
  * @resolve - parsed entity data
*/
export const getEntity = (endpoint) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET'
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve(parseEntity(body))
      }

      reject()
    })
  })
}

/**
  * @desc - get categories
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $qs - extra options to be passed along as query strings
  * @resolve - object with paging information and parsed category data
*/
export const getCategories = (endpoint, qs={}) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET',
      qs: qs
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve({
          paging: {
            next: (body.paging.next === null) ? null : body.page + 1
          },
          categories: body.data.map((category) => {
            return parseCategory(category)
          })
        })
      }

      reject()
    })
  })
}

/**
  * @desc - get category
  * @param string $endpoint - request endpoint for Vimeo's API
  * @resolve - parsed category data
*/
export const getCategory = (endpoint) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET'
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve(parseCategory(body))
      }

      reject()
    })
  })
}

/**
  * @desc - get users
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $qs - extra options to be passed along as query strings
  * @resolve - object with paging information and parsed user data
*/
export const getUsers = (endpoint, qs={}) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET',
      qs: qs
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve({
          paging: {
            next: (body.paging.next === null) ? null : body.page + 1
          },
          users: body.data.map((user) => {
            return parseUser(user)
          })
        })
      }

      reject()
    })
  })
}

/**
  * @desc - get user
  * @param string $endpoint - request endpoint for Vimeo's API
  * @resolve - parsed user data
*/
export const getUser = (endpoint) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET'
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve(parseUser(body))
      }

      reject()
    })
  })
}

/**
  * @desc - get videos
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $qs - extra options to be passed along as query strings
  * @resolve - object with paging information and parsed video data
*/
export const getVideos = (endpoint, qs={}) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET',
      qs: qs
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve({
          paging: {
            next: (body.paging.next === null) ? null : body.page + 1
          },
          videos: body.data.map((video) => {
            return parseVideo(video)
          })
        })
      }

      reject()
    })
  })
}

/**
  * @desc - get video
  * @param string $endpoint - request endpoint for Vimeo's API
  * @resolve - parsed video data
*/
export const getVideo = (endpoint) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET'
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve(parseVideo(body))
      }

      reject()
    })
  })
}

/**
  * @desc - get comments
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $qs - extra options to be passed along as query strings
  * @resolve - object with paging information and parsed comment data
*/
export const getComments = (endpoint, qs={}) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET',
      qs: qs
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve({
          paging: {
            next: (body.paging.next === null) ? null : body.page + 1
          },
          comments: body.data.map((comment) => {
            return parseComment(comment)
          })
        })
      }

      reject()
    })
  })
}

/**
  * @desc - check if user is following and entity (i.e. Channels, Groups, Albums, etc)
  * @param string $endpoint - request endpoint for Vimeo's API
  * @resolve - true if user is following else false
*/
export const checkSubscription = (endpoint) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'GET'
    }, (error, response, body) => {
      if (response.statusCode === 204) {
        resolve(true)
      } else if (response.statusCode === 404) {
        resolve(false)
      }

      reject()
    })
  })
}

/**
  * @desc - follow an entity (i.e. Channels, Groups, Albums, etc)
  * @param string $endpoint - request endpoint for Vimeo's API
*/
export const subscribe = (endpoint) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'PUT'
    }, (error, response, body) => {
      if (response.statusCode === 204) {
        resolve()
      }

      reject()
    })
  })
}

/**
  * @desc - unfollow an entity (i.e. Channels, Groups, Albums, etc)
  * @param string $endpoint - request endpoint for Vimeo's API
*/
export const unsubscribe = (endpoint) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'DELETE'
    }, (error, response, body) => {
      if (response.statusCode === 204) {
        resolve()
      }

      reject()
    })
  })
}

/**
  * @desc - post a comment on a video
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $body - object containing comment
  * @resolve - parsed video data
*/
export const postComment = (endpoint, body) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'POST',
      body: body
    }, (error, response, body) => {
      if (response.statusCode === 201) {
        resolve(parseComment(body))
      }

      reject()
    })
  })
}

/**
  * @desc - deletes a comment on a video
  * @param string $endpoint - request endpoint for Vimeo's API
*/
export const deleteComment = (endpoint) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'DELETE'
    }, (error, response, body) => {
      if (response.statusCode === 204) {
        resolve()
      }

      reject()
    })
  })
}

/**
  * @desc - edits a comment on a video
  * @param string $endpoint - request endpoint for Vimeo's API
  * @param string $body - object containing comment
*/
export const editComment = (endpoint, body) => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: endpoint,
      method: 'PATCH',
      body: body
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve()
      }

      reject()
    })
  })
}