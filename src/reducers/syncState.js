import {
    UPDATE_SYNC_STATE,
} from '../actions/syncState'

import { 
    SETUP_GAME_FROM_SERVER, SETUP_GAME, 
    ERROR_NO_GAME, CREATE_GAME, 
    UPDATE_SELECTED_PLAYERS, START_GAME,
    UPDATE_GAMESTACK
} from '../actions'

const syncState = (state = {}, action)  => {    
    switch (action.type) {
        case SETUP_GAME:
            return action.syncState
        case START_GAME:
            return {
                ...state,
                gameStarted: action.gameStarted
            }
        case SETUP_GAME_FROM_SERVER:
        case CREATE_GAME:
            return action.updates.syncState
        case UPDATE_SYNC_STATE:
        case UPDATE_GAMESTACK:
            return {
                ...state,
                ...action.updates
            }
        case ERROR_NO_GAME:
            return {
                ...state,
                errorMessage: action.message
            }
        case UPDATE_SELECTED_PLAYERS:
            return {
                ...state,
                players: action.players
            }
        default:
           return state
    }
}

export default syncState
