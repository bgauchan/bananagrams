import syncState from './syncState'
import localState from './localState'
import notifications from './notifications'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    syncState,
    localState,
    notifications
})

export default rootReducer