
export function getShuffledPieces(count, personalStack, fillerTiles) {
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