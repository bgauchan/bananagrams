import postsBySubreddit from './postsBySubreddit'
import selectedSubreddit from './selectedSubreddit'
import readPosts from './readPosts'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    readPosts,
    postsBySubreddit,
    selectedSubreddit,
})

export default rootReducer