import Numeral from 'numeral'
import Moment from 'moment'


export const parseCategory = (category) => {
  return {
    uri: category.uri,
    name: category.name,
    picture: (!category.pictures) ? null : category.pictures.sizes[category.pictures.sizes.length - 1].link,
    subcategories: category.subcategories.map((subcategory) => {
      return {
        uri: `${subcategory.uri}/videos`,
        name: subcategory.name
      }
    }),
    icon: category.icon.sizes[0].link
  }
}

export const parseUser = (user) => {
  return {
    uri: user.uri,
    name: user.name,
    description: user.description,
    picture: (!user.pictures) ? 'https://secure.gravatar.com/avatar/59fe2a8239449ae64bda7c35995b5994?d=https%3A%2F%2Fi.vimeocdn.com%2Fportrait%2Fdefaults-blue_300x300.png&s=300' : user.pictures.sizes[user.pictures.sizes.length - 1].link,
    followers: Numeral(user.metadata.connections.followers.total).format('0a'),
    videos: Numeral(user.metadata.connections.videos.total).format('0a')
  }
}

export const parseEntity = (entity) => {
  return {
    uri: entity.uri,
    name: entity.name,
    description: (!entity.description) ? 'No description available...' : entity.description,
    banner: (!entity.header) ? null : entity.header.sizes[entity.header.sizes.length - 1].link,
    picture: (!entity.pictures) ? null : entity.pictures.sizes[entity.pictures.sizes.length - 1].link,
    followers: (!entity.metadata.connections.users) ? null : Numeral(entity.metadata.connections.users.total).format('0a'),
    videos: Numeral(entity.metadata.connections.videos.total).format('0a')
  }
}

export const parseVideo = (video) => {
  return {
    uri: video.uri,
    name: video.name,
    description: video.description,
    duration: Numeral(video.duration).format('00:00:00'),
    picture: (!video.pictures) ? null : video.pictures.sizes[video.pictures.sizes.length - 1].link,
    plays: Numeral((!video.stats.plays) ? 0 : video.stats.plays).format('0a'),
    likes: Numeral(video.metadata.connections.likes.total).format('0a'),
    comments: {
      uri: video.metadata.connections.comments.uri,
      total: Numeral(video.metadata.connections.comments.total).format('0a')
    },
    tags: video.tags.map((tag) => {
      return {
        uri: tag.uri,
        name: tag.name
      }
    }),
    user: {
      uri: video.user.uri,
      name: video.user.name,
      picture: (video.user.pictures === null) 
        ? 'https://i.vimeocdn.com/portrait/defaults-blue_300x300.png' 
        : video.user.pictures.sizes[video.user.pictures.sizes.length - 1].link
    }
  }
}

export const parseComment = (comment) => {
  return {
    uri: comment.uri,
    message: comment.text,
    time: Moment(comment.created_on).fromNow(),
    replies: {
      uri: comment.metadata.connections.replies.uri,
      total: comment.metadata.connections.replies.total,
    },
    user: {
      uri: comment.user.uri,
      name: comment.user.name,
      picture: (comment.user.pictures === null) 
        ? 'https://i.vimeocdn.com/portrait/defaults-blue_300x300.png' 
        : comment.user.pictures.sizes[comment.user.pictures.sizes.length - 1].link
    }
  }
}