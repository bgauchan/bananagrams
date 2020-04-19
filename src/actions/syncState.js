import db from '../firebase'
import { getShuffledPieces } from '../helpers'

export const INITIALIZE_SYNC_STATE = 'INITIALIZE_SYNC_STATE'
export const DUMP_TILE = 'DUMP_TILE'

const settingsRef = db.ref('game/settings')

function initializeSyncState(syncState) {
    return { type: INITIALIZE_SYNC_STATE, syncState }
}

export function handleInitializeSyncState(numOfPlayers, numOfPersonalTiles, numOfGameTiles) {
    // only save the syncState with firebase
    return (dispatch, getState) => {
        let syncState = {
            numOfPlayers,
            numOfPersonalTiles,
            numOfGameTiles,
            gameStack: getShuffledPieces(numOfGameTiles)
        }

        settingsRef.set(syncState)
        .then(() => {
            dispatch(initializeSyncState(syncState))
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}

function dumpTile(updates) {
    return { type: DUMP_TILE, updates }
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
        
        // update db
        settingsRef.transaction(function(currentGameStack) {
            return {
                gameStack: updatedGameStack
            }
        })
        .then(() => {
            dispatch(dumpTile(finalUpdates))
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}
