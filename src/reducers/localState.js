
import { 
    UPDATE_LOCAL_STATE,
    REMOVE_NEW_STATUS
} from '../actions/localState'

import {
    PLAYER_SELECTED
} from '../actions'

let defaultState =  {
    isPlaying: false,
    personalStack: [],
    solvedStack: [...Array(360)],
    dumpStack: [...Array(1)]
}


const localState = (state = defaultState, action)  => {
    switch (action.type) {
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
