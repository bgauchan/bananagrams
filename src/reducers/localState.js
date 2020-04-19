import { DUMP_TILE } from '../actions/syncState'
import { INITIALIZE_LOCAL_STATE, MOVE_TILE } from '../actions/localState'

let defaultState =  {
    personalStack: [],
    solvedStack: [...Array(360)],
    dumpStack: [...Array(1)]
}


const localState = (state = defaultState, action)  => {
    switch (action.type) {
        case INITIALIZE_LOCAL_STATE:
            return {
                ...state,
                ...action.localState
            }
        case MOVE_TILE:
        case DUMP_TILE:
            return {
                ...state,
                ...action.updates.localStateUpdates
            }
        default:
           return state
    }
}

export default localState
