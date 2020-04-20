import {
    START_GAME,
    INITIALIZE_SYNC_STATE,
    UPDATE_SYNC_STATE
} from '../actions/syncState'

let defaultState =  {
    gameStarted: false
}
  
const syncState = (state = defaultState, action)  => {    
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                gameStarted: action.gameStarted
            }
        case INITIALIZE_SYNC_STATE:
            return {
                ...state,
                ...action.syncState
            }
        case UPDATE_SYNC_STATE:
            return {
                ...state,
                ...action.updates
            }
        default:
           return state
    }
}

export default syncState
