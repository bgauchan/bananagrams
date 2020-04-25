
import db from '../firebase'
import { getShuffledtiles } from '../helpers'

export const SETUP_GAME = 'SETUP_GAME'
export const SETUP_GAME_FROM_SERVER = 'SETUP_GAME_FROM_SERVER'
export const ERROR_NO_GAME = 'ERROR_NO_GAME'

export function handleSetupGame() {
    return (dispatch, getState) => {
        let pathName = window.location.pathname
        
        // if game ID is in url, check if it exists in db
        if(pathName.indexOf('game') > -1) {
            let gameID = pathName.substring(pathName.indexOf('game') + 5)
            
            db.ref('/game/' + gameID).once('value')
            .then((snapshot) => {
                // if game doesn't exist, show error
                if(!snapshot.val()) {
                    dispatch({
                        type: ERROR_NO_GAME,
                        message: `Sorry, that game doesn't exist!`
                    })

                    return
                }
        
                // if game already exists load it from db
                dispatch({
                    type: SETUP_GAME_FROM_SERVER,
                    syncState: snapshot.val()
                })
            })
        } else {
            // if no game ID in url, setup from local
            let syncState = {
                gameStarted: false,
                gameStack: getShuffledtiles()
            }
        
            dispatch({ type: SETUP_GAME, syncState })
        }
    }
}

export const CREATE_GAME = 'CREATE_GAME'

export function handleCreateGame() {
    return (dispatch, getState) => {
        let { syncState } = getState()

        // create a new game ID
        let newGameID = db.ref('game').push().key
        let action = { 
            type: CREATE_GAME, 
            syncState: {
                ...syncState,
                gameID: newGameID 
            }
        }

        // save game to db and then change the url
        db.ref('/game/' + newGameID).set(action.syncState)
        .then(() => {
            window.history.pushState(null, '', `/game/${newGameID}`);   
            dispatch(action)
        })
    }
}

export const UPDATE_SELECTED_PLAYERS = 'UPDATE_SELECTED_PLAYERS'

export function handlePlayers() { 
    return (dispatch, getState) => {
        let { syncState } = getState()
        let gameID = syncState.gameID

        // put a listener on settings ref so we can dispatch updates
        // as soon as we detect any update
        db.ref('/game/' + gameID + '/players').on('value', function(snapshot) {
            dispatch({
                type: UPDATE_SELECTED_PLAYERS,
                players: snapshot.val()
            })
        });
    }
}

export const PLAYER_SELECTED = 'PLAYER_SELECTED'

export function handleSelectPlayer(playerID) {
    return (dispatch, getState) => {
        let { syncState } = getState()
        let gameID = syncState.gameID

        // update db
        db.ref('/game/' + gameID + '/players').transaction((players) => {
            if(players) {
                return [ ...players, { playerID }]
            }

            return [{ playerID }]
        })
        .then(() => {
            dispatch({
                type: PLAYER_SELECTED,
                playerID: playerID
            })
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))    
    }
}

// Start Game

export function handleStartGame() {
    return (dispatch, getState) => {   
        let { syncState } = getState() 
        let gameStack = [...syncState.gameStack]
        let players = [...syncState.players]

        let numOfPersonalTiles = 21
	
		if(players.length > 6) {
			numOfPersonalTiles = 11
		} else if(players.length > 4) {
			numOfPersonalTiles = 15
        }
        
        let updatedPlayers = []

        players.forEach((p) => {
            updatedPlayers.push({
                playerID: p.playerID,
                personalStack: gameStack.splice(0, numOfPersonalTiles)
            })
        })
    }
}

/************************ Notifications ************************/

function sendNotification(notification) {
    return { type: SEND_NOTIFICATION, notification }
}

export const SEND_NOTIFICATION = 'SEND_NOTIFICATION'

export function handleSendNotification(notification) {
    return (dispatch, getState) => {    
        let notificationID = Date.now()
        notification.id = notificationID

        dispatch(sendNotification(notification))

        // remove notification after 4 seconds
        setTimeout(() => {
            dispatch(removeNotification(notificationID))
        }, 4000);
    }
}

export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

function removeNotification(id) {
    return { type: REMOVE_NOTIFICATION, id }
}