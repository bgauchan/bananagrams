import { START_GAME } from '../actions'
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
            return {
                ...state,
                ...action.updates
            }
        default:
           return state
    }
}

export default localState
