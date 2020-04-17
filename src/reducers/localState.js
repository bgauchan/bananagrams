import {
    START_GAME,

} from '../actions'

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
        default:
           return state
    }
}

export default localState
