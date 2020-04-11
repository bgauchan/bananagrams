import db from '../firebase'

export const SETUP_GAME = 'SETUP_GAME'

db.ref('game').set({
    hasStarted: false
});

export function setupGame(game) {
    return { type: SETUP_GAME, game }
}

export function markPostAsRead(postID) {
    return (dispatch, getState) => {
        
    }
}
