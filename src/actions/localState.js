import db from '../firebase'

export const MOVE_TILE = 'MOVE_TILE'

function moveTile(tile) {
    return { type: MOVE_TILE, tile }
}

export function handleMoveTile(tile) {
}
