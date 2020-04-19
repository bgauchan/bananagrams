
import { handleDumpTile } from './index'

export const MOVE_TILE = 'MOVE_TILE'

function moveTile(updates) {
    return { type: MOVE_TILE, updates }
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
        [originStackName]: originStack,
        [targetName]: targetStack
    }
}

export function handleDumpOrMoveTile(e, index, targetName) {
    return (dispatch, getState) => {        
        let { localState } = getState()
        let updates = getUpdates(e, index, targetName, localState)

        // if no update was made, don't dispatch
        if(!updates) return

        if(targetName === 'dumpStack') {
            dispatch(handleDumpTile(updates))
        } else {
            dispatch(moveTile(updates))
        }
    }
}
