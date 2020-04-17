import syncState from './syncState'
import localState from './localState'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    syncState,
    localState
})

export default rootReducer