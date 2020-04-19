import db from '../firebase'
import { getShuffledPieces } from '../helpers'

export const START_GAME = 'START_GAME'
export const DUMP_TILE = 'DUMP_TILE'

function startGame(game) {
    return { type: START_GAME, game }
}

function dumpTile(updates) {
    return { type: DUMP_TILE, updates }
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

function getPersonalStackAfterDump(personalStack) {		
    let extraThreeTiles = getShuffledPieces(3)

    let updatedStack = personalStack.map((tile, index) => {
        // if there are empty slots, fill those up first
        if(tile === undefined && extraThreeTiles.length > 0) {
            let newTile = extraThreeTiles.shift() // take one of the extra tiles
            newTile.order = index
            newTile.isNew = true
            return newTile
        } else {
            return tile
        }
    })
    
    let nextOrder = updatedStack.length
    
    // if all the 3 extra tiles haven't been swapped in, add them to the end
    extraThreeTiles.forEach(tile => {
        tile.order = nextOrder
        tile.isNew = true
        nextOrder++
        updatedStack.push(tile)
    })
    
    return updatedStack
}

export function handleDumpTile(updates) {
    return (dispatch, getState) => {        
        let { syncState, localState } = getState()

        // only dump if the game stack has more than 3 tiles left
        if(syncState.gameStack.length < 3) {
            // dispatch a notification here
            return
        }

        // if its a tile being dumped, take 3 tiles from game stack
        // and put it in personal stack AND take the dumped tile, and
        // put it in the game stack		
        let updatedPersonalStack = getPersonalStackAfterDump(localState.personalStack)

        let localStateUpdates = { 
            ...updates,
            personalStack: updatedPersonalStack,
            dumpStack: [undefined]
        }

        let updatedGameStack = [...syncState.gameStack]
        updatedGameStack.splice(0, 3)

        let finalUpdates = {
            localStateUpdates,
            syncStateUpdates: updatedGameStack
        }

        dispatch(dumpTile(finalUpdates))

        // let localState = {
        //     ...prevLocalState,
        //     personalStack: getShuffledPieces(numOfPersonalTiles)
        // }

        // db.ref('game').set({
        //     settings: syncState
        // })
        // .then(() => {
        //     dispatch(startGame({ syncState, localState }))
        // })
        // .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}
