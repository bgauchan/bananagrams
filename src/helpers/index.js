
export function getShuffledtiles(count) {
    const tiles = [
        'J', 'J', 'K', 'K', 'Q', 'Q', 'X', 'X', 'Z', 'Z',
        'B', 'B', 'B', 'C', 'C', 'C', 'F', 'F', 'F',
        'H', 'H', 'H', 'M', 'M', 'M', 'P', 'P', 'P',
        'V', 'V', 'V', 'W', 'W', 'W', 'Y', 'Y', 'Y',
        'G', 'G', 'G', 'G', 'L', 'L', 'L', 'L', 'L',
        'D', 'D', 'D', 'D', 'D', 'D', 'S', 'S', 'S', 'S', 'S', 'S',
        'U', 'U', 'U', 'U', 'U', 'U',
        'N', 'N', 'N', 'N', 'N', 'N', 'N', 'N',
        'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T', 'T',
        'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R',
        'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O',
        'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I', 'I',
        'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A',
        'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E',
        'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E',
    ]

    let shuffledTiles = []

    for(let i = 0; i < tiles.length; i++) {
        let randomIndex = Math.floor(Math.random() * 143) + 1

        shuffledTiles.push({
            tile: tiles[randomIndex],
            order: i,
            isNew: false,
            board: 'personalStack'
        })
    }
    
    return shuffledTiles
}