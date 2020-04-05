import { MARK_POST_AS_READ, RECEIVE_READ_POSTS } from '../actions'
  
const readPosts = (state = [], action) => {
    switch (action.type) {
        case MARK_POST_AS_READ:
            return [...state, action.postID]
        case RECEIVE_READ_POSTS:            
            return action.ids
        default:
            return state
    }
}

export default readPosts