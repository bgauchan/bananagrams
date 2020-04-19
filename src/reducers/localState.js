import { START_GAME, DUMP_TILE } from '../actions'
import { MOVE_TILE } from '../actions/localState'

let defaultState =  {
    personalStack: [],
    solvedStack: [...Array(360)],
    dumpStack: [...Array(1)]
}


const localState = (state = defaultState, action)  => {
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                ...action.game.localState
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
