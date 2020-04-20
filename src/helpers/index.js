
export function getShuffledPieces(count) {
    const pieces = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    let shuffledPieces = []

    for(let i = 0; i < count; i++) {
        let randomIndex = Math.floor(Math.random() * 25) + 1

        shuffledPieces.push({
            tile: pieces[randomIndex],
            order: i,
            isNew: false,
            board: 'personalStack'
        })
    }

    return shuffledPieces
}