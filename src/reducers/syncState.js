import {
    START_GAME,
    DUMP_TILE
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
        case DUMP_TILE:
            return {
                ...state,
                'gameStack': action.updates.syncStateUpdates
            }
        default:
           return state
    }
}

export default syncState
