
import { 
    UPDATE_LOCAL_STATE,
    REMOVE_NEW_STATUS
} from '../actions/localState'

import {
    PLAYER_SELECTED, CREATE_GAME,
    SETUP_GAME_FROM_SERVER 
} from '../actions'

let defaultState =  {
    isPlaying: false,
    personalStack: [],
    solvedStack: [...Array(440)],
    dumpStack: [...Array(1)]
}

const localState = (state = defaultState, action)  => {
    switch (action.type) {
        case CREATE_GAME: 
            return action.updates.localState
        case SETUP_GAME_FROM_SERVER:
            return {
                ...state,
                ...action.updates.localState
            }
        case UPDATE_LOCAL_STATE:
        case REMOVE_NEW_STATUS:
            return {
                ...state,
                ...action.updates
            }
        case PLAYER_SELECTED:
            return {
                ...state,
                playerSelected: action.playerID
            }
        default:
           return state
    }
}

export default localState
