import db from '../firebase'
import { getShuffledPieces } from '../helpers'
import { updateLocalState, handleRemoveNewStatus } from './localState'

export const INITIALIZE_SYNC_STATE = 'INITIALIZE_SYNC_STATE'
export const UPDATE_SYNC_STATE = 'UPDATE_SYNC_STATE'
export const START_GAME = 'START_GAME'
export const DUMP_TILE = 'DUMP_TILE'

const settingsRef = db.ref('game/settings')

function startGame() {
    return { type: START_GAME, gameStarted: true }
}

export function handleStartGame() {
    return (dispatch, getState) => {
        let { syncState } = getState()

        let updatedSyncState = {
            ...syncState,
            gameStarted: true
        }
        
        settingsRef.set(updatedSyncState)
        .then(() => {
            dispatch(startGame())
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}

function initializeSyncState(syncState) {
    return { type: INITIALIZE_SYNC_STATE, syncState }
}

export function handleInitializeSyncState(numOfPlayers, numOfPersonalTiles, numOfGameTiles) {
    // only save the syncState with firebase
    return (dispatch, getState) => {
        let initialState = {
            gameStarted: false,
            numOfPlayers,
            numOfPersonalTiles,
            numOfGameTiles,
            gameStack: getShuffledPieces(numOfGameTiles)
        }

        settingsRef.set(initialState)
        .then(() => {
            dispatch(initializeSyncState(initialState))
            dispatch(handleStartGame())

            // put a listener on settings ref so we can dispatch updates
            // as soon as we detect any update
            settingsRef.on('value', function(snapshot) {
                let { syncState } = getState()
                let updates = snapshot.val()
                
                if(syncState.gameStarted) {
                    dispatch(updateSyncState({ ...updates, gameStarted: true }))
                }
            });
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}

function dumpTile(tile) {
    return { type: DUMP_TILE, tile }
}

function updateSyncState(updates) {
    return { type: UPDATE_SYNC_STATE, updates }
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
            ...updates.localState,
            personalStack: updatedPersonalStack,
            dumpStack: [undefined]
        }

        let updatedGameStack = [...syncState.gameStack]
        // user dumps 1 back in, game stack gives 3 out
        // so the deduction from stack is 2 tiles
        updatedGameStack.splice(0, 2) 
        
        // update db
        settingsRef.transaction(function(prevSettings) {
            return {
                ...prevSettings,
                gameStack: updatedGameStack
            }
        })
        .then(() => {
            dispatch(dumpTile(updates.tile))
            dispatch(updateLocalState(localStateUpdates))

            // remove new status from tiles in personal stack after 5s
            setTimeout(() => {
                dispatch(handleRemoveNewStatus())
            }, 5000);
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}
