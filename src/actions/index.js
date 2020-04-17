import db from '../firebase'
import { getShuffledPieces } from '../helpers'

export const START_GAME = 'START_GAME'

function startGame(game) {
    return { type: START_GAME, game }
}

export function handleSetupAndStartGame(numOfPlayers) {
    let totalTiles = 144
    let numOfPersonalTiles = 21
    let numOfGameTiles = totalTiles - (numOfPlayers * numOfPersonalTiles)

    if(numOfPlayers > 6) {
        numOfPersonalTiles = 11
        numOfGameTiles = totalTiles - (numOfPlayers * numOfPersonalTiles)
    } else if(numOfPlayers > 4) {
        numOfPersonalTiles = 15
        numOfGameTiles = totalTiles - (numOfPlayers * numOfPersonalTiles)
    }

    // only save the syncState with firebase
    return (dispatch, getState) => {
        let syncState = {
            numOfPlayers,
            numOfPersonalTiles,
            numOfGameTiles,
            gameStack: getShuffledPieces(numOfGameTiles)
        }

        let prevLocalState = getState().localState
    
        let localState = {
            ...prevLocalState,
            personalStack: getShuffledPieces(numOfPersonalTiles)
        }

        db.ref('game').set({
            settings: syncState
        })
        .then(() => {
            dispatch(startGame({ syncState, localState }))
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}
