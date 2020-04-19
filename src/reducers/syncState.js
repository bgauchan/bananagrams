import {
    INITIALIZE_SYNC_STATE,
    DUMP_TILE
} from '../actions/syncState'

let defaultState =  {
    gameStarted: false
}
  
const syncState = (state = defaultState, action)  => {    
    switch (action.type) {
        case INITIALIZE_SYNC_STATE:
            return {
                ...state,
                ...action.syncState
            }
        case DUMP_TILE:
            return {
                ...state,
                'gameStack': action.updates.syncStateUpdates
            }
        default:
           return state
    }
}

export default syncState
