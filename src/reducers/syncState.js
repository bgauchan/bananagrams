import {
    START_GAME,
} from '../actions'

let defaultState =  {
    gameStarted: false
}
  
const syncState = (state = defaultState, action)  => {
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                ...action.game.syncState
            }
        default:
           return state
    }
}

export default syncState
