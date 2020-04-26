import db from '../firebase'
import { handleSendNotification } from './index'
import { handleUpdateLocalState, handleRemoveNewStatus } from './localState'
import { getShuffledTiles } from '../helpers'

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

function dumpTile(tile) {
    return { type: DUMP_TILE, tile }
}

export const UPDATE_SYNC_STATE = 'UPDATE_SYNC_STATE'

export function handleUpdateSyncState(updates) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_SYNC_STATE,
            updates
        })
    }
}

function getPersonalStackAfterDump(personalStack) {		
    let extraThreeTiles = getShuffledTiles(3)
    
    let updatedStack = personalStack.map((tile, index) => {
        // if there are empty slots, fill those up first
        if(tile === null && extraThreeTiles.length > 0) {
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
        let gameID = localState.gameID

        // only dump if the game stack has more than 3 tiles left
        if(syncState.gameStack.length < 0) {
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

        // update db
        db.ref('/game/' + gameID + '/gameStack').transaction((prevGameStack) => {
            // user dumps 1 back in, game stack gives 3 out
            // so the deduction from stack is 2 tiles
            prevGameStack.splice(0, 2)
            return prevGameStack
        })
        .then(() => {
            dispatch(handleSendNotification({
                type: 'dumpTile',
                text: `${localState.playerSelected} dumped a tile!`
            }))

            dispatch(dumpTile(updates.tile))
            dispatch(handleUpdateLocalState(localStateUpdates))

            // remove new status from tiles in personal stack after 5s
            setTimeout(() => {
                dispatch(handleRemoveNewStatus())
            }, 5000);
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}
