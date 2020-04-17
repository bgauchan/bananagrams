import db from '../firebase'

export const START_GAME = 'START_GAME'

function startGame(game) {
    return { type: START_GAME, game }
}

function getShuffledPieces(count, personalStack, fillerTiles) {
    const pieces = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    let shuffledPieces = []
    let personalStackCount = personalStack ? personalStack.length : 0

    for(let i = 0; i < count; i++) {
        let randomIndex = Math.floor(Math.random() * 25) + 1

        shuffledPieces.push({
            tile: pieces[randomIndex],
            order: fillerTiles ? personalStackCount++ : i,
            board: 'personalStack'
        })
    }

    return shuffledPieces
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
