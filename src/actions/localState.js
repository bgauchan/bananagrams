
import { handleDumpTile } from './syncState'

export const INITIALIZE_LOCAL_STATE = 'INITIALIZE_LOCAL_STATE'
export const UPDATE_LOCAL_STATE = 'UPDATE_LOCAL_STATE'
export const MOVE_TILE = 'MOVE_TILE'
export const REMOVE_NEW_STATUS = 'REMOVE_NEW_STATUS'

// function initializeLocalState(localState) {
//     return { type: INITIALIZE_LOCAL_STATE, localState }
// }

// export function handleInitializeLocalState(numOfPersonalTiles) {
//     return (dispatch, getState) => {
//         let prevLocalState = getState().localState
    
//         let localState = {
//             ...prevLocalState,
//             personalStack: getShuffledPieces(numOfPersonalTiles)
//         }
        
//         dispatch(initializeLocalState(localState)) 
//     }
// }

function moveTile(tile) {
    return { type: MOVE_TILE, tile }
}

export function updateLocalState(updates) {
    return { type: UPDATE_LOCAL_STATE, updates }
}

function getUpdates(e, index, targetName, localState) {
    // if you're dropping at the spot where a tile is already there, 
    // do nothing
    let targetStack = localState[targetName];
    if (targetStack[index]) return;

    // get the order of the tile dropped and the original board it was in
    // (comes in as 'order_board' format)
    const originOrderAndStack = e.dataTransfer.getData('text').split('_')
    let originOrder = originOrderAndStack[0]
    let originStackName = originOrderAndStack[1]
    let originTile = localState[originStackName].find(p => p && (p.order === +originOrder))

    // since we dragged it out, remove it from the original stack
    let originStack = localState[originStackName]
    originStack[originOrder] = undefined	
    
    // add it to new stack with update info like the new order in target stack
    // and the board as well
    targetStack[index] = {
        ...originTile,
        order: index,
        board: targetName
    }

    return {
        tile: originTile,
        localState: { 
            [originStackName]: originStack,
            [targetName]: targetStack
        }
    }
}

export function handleDumpOrMoveTile(e, index, targetName) {
    return (dispatch, getState) => {        
        let { localState } = getState()
        let updates = getUpdates(e, index, targetName, localState)

        // if no update was made, don't dispatch
        if(!updates) return

        // if just moving tiles, then it doesn't affect our sync state
        // where as dumping tile affects both state
        if(targetName === 'dumpStack') {
            dispatch(handleDumpTile(updates))
        } else {
            dispatch(moveTile(updates.tile))
            dispatch(updateLocalState(updates.localState))
        }
    }
}

function removeNewStatus(updates) {
    return { type: REMOVE_NEW_STATUS, updates }
}

export function handleRemoveNewStatus() {
    return (dispatch, getState) => { 
        let { localState } = getState()
        let updatedPersonalStack = [ ...localState.personalStack ]
        let updatedSolvedStack = [ ...localState.solvedStack ]
        
        updatedPersonalStack.map(tile => tile ? tile.isNew = false : undefined)
        updatedSolvedStack.map(tile => tile ? tile.isNew = false : undefined)

        let update = {
            personalStack: updatedPersonalStack,
            solvedStack: updatedSolvedStack
        }

        dispatch(removeNewStatus(update))
    }
}