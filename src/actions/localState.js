import db from '../firebase'
import { getShuffledPieces } from '../helpers'

export const MOVE_TILE = 'MOVE_TILE'

function moveTile(updates) {
    return { type: MOVE_TILE, updates }
}

function getPersonalStackAfterDump(personalStack) {		
    let extraThreeTiles = getShuffledPieces(3, true)

    let updatedStack = personalStack.map((tile, index) => {
        // if there are empty slots, fill those up first
        if(tile === undefined && extraThreeTiles.length > 0) {
            return extraThreeTiles.shift() // take one of the extra tiles
        } else {
            return tile
        }
    })
    
    // if all the 3 extra tiles haven't been swapped in, add them to the end
    if(extraThreeTiles.length > 0) {
        updatedStack = [...updatedStack, ...extraThreeTiles]
    }
    
    return updatedStack
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

    let updates = {}
    
    if(targetName === 'dumpStack') {
        // if its a tile being dumped, take 3 tiles from game stack
        // and put it in personal stack AND take the dumped tile, and
        // put it in the game stack		
        let updatedPersonalStack = getPersonalStackAfterDump(localState.personalStack)
        
        updates = { 
            [originStackName]: originStack,
            [targetName]: targetStack,
            personalStack: updatedPersonalStack
        }
    } else {		
        updates = { 
            [originStackName]: originStack,
            [targetName]: targetStack
        }
    }

    return updates
}

export function handleMoveTile(e, index, targetName) {
    return (dispatch, getState) => {
        let { localState } = getState()
        let updates = getUpdates(e, index, targetName, localState)
                
        dispatch(moveTile(updates))
    }
}
