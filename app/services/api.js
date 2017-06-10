import Request from 'request'

import { parseVideo, parseComment, parseUser, parseEntity, parseCategory } from './responseParser.js'


const VimeoRequest = Request.defaults({
  baseUrl: 'https://api.vimeo.com/',
  auth: { 
    bearer: localStorage.getItem('accessToken')
  },
  json: true
})

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

        resolve()
      }

      reject()
    })
  })
}

export const logout = () => {
  return new Promise((resolve, reject) => {
    VimeoRequest({
      url: '/tokens',
      method: 'DELETE'
    }, (error, response, body) => {
      if (response.statusCode === 200) {
        localStorage.clear()

        resolve()
      }

      reject()
    })
  })
}

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

export const getChannels = (endpoint, qs={}) => {
  return getListings(endpoint, 'channels', qs)
}

export const getGroups = (endpoint, qs={}) => {
  return getListings(endpoint, 'groups', qs)
}

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