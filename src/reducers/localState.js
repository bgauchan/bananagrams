
import { INITIALIZE_LOCAL_STATE, UPDATE_LOCAL_STATE } from '../actions/localState'

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
        case UPDATE_LOCAL_STATE:
            return {
                ...state,
                ...action.updates
            }
        default:
           return state
    }
}

export default localState
