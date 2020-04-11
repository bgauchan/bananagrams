import {
    SETUP_GAME,
} from '../actions'
  
const game = (state = {}, action)  => {
    switch (action.type) {
        case SETUP_GAME:
            return {
                ...state,
            }
        default:
           return state
    }
}

export default game
