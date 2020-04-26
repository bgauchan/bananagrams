
import db from '../firebase'
import { getShuffledTiles } from '../helpers'
import { handleUpdateSyncState } from './syncState'
import { handleUpdateLocalState } from './localState'

export const SETUP_GAME = 'SETUP_GAME'
export const SETUP_GAME_FROM_SERVER = 'SETUP_GAME_FROM_SERVER'
export const ERROR_NO_GAME = 'ERROR_NO_GAME'

export function handleSetupGame() {
    return (dispatch) => {
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

                let updatedLocalState = { gameID }
                let localStateCache = JSON.parse(localStorage.getItem("localStateCache"))
                let cacheHasNotExpired = localStateCache.expiryTimestamp > Date.now()
                
                if(cacheHasNotExpired) {
                    updatedLocalState = {
                        ...localStateCache,
                        gameID
                    }
                }
        
                // if game already exists load it from db
                dispatch({
                    type: SETUP_GAME_FROM_SERVER,
                    updates: {
                        localState: updatedLocalState,
                        syncState: snapshot.val()
                    }
                })
            })
        } else {
            // if no game ID in url, setup from local
            let syncState = {
                gameStarted: false,
                gameStack: getShuffledTiles()
            }
        
            dispatch({ type: SETUP_GAME, syncState })
        }
    }
}

export const CREATE_GAME = 'CREATE_GAME'

export function handleCreateGame() {
    return (dispatch, getState) => {
        let { localState, syncState } = getState()

        // create a new game ID
        let newGameID = db.ref('game').push().key

        let action = { 
            type: CREATE_GAME, 
            updates: {
                localState: { 
                    ...localState, 
                    gameID: newGameID, 
                },
                syncState: { 
                    ...syncState,
                    dateCreated: (new Date()).toString() 
                }
            }
        }

        // save game to db and then change the url
        db.ref('/game/' + newGameID).set(action.updates.syncState)
        .then(() => {
            window.history.pushState(null, '', `/game/${newGameID}`);   
            dispatch(action)
        })
    }
}

export const UPDATE_SELECTED_PLAYERS = 'UPDATE_SELECTED_PLAYERS'

export function handlePlayers() { 
    return (dispatch, getState) => {
        let { localState } = getState()
        let gameID = localState.gameID

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
        let { localState } = getState()
        let gameID = localState.gameID

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

export const START_GAME = 'START_GAME'

export function handleStartGame() {
    return (dispatch, getState) => {   
        let { syncState, localState } = getState() 
        let gameID = localState.gameID
        let gameStack = [...syncState.gameStack]
        let players = [...syncState.players]

        let numOfPersonalTiles = 21
	
		if(players.length > 6) {
			numOfPersonalTiles = 11
		} else if(players.length > 4) {
			numOfPersonalTiles = 15
        }

        // ----- lets divide up the tiles from game stack to players ------
        
        let updatedPlayers = [] 
        let updatedPersonalStack = [] 

        players.forEach((p) => {
            let personalStack = gameStack.splice(0, numOfPersonalTiles)
            
            // stack for the current player
            if(p.playerID === localState.playerSelected) {
                updatedPersonalStack = personalStack
            }

            // add id and stack to each player
            updatedPlayers.push({
                playerID: p.playerID,
                personalStack
            })
        })

        // ----- now let's set up initial states for local and sync ------

        let initialSyncState = {
            ...syncState,
            players: updatedPlayers,
            gameStack,
            gameStarted: true
        }

        let initialLocalState = {
            ...localState,
            personalStack: updatedPersonalStack,
            isPlaying: true
        }

        db.ref('/game/' + gameID).set(initialSyncState)
        .then(() => {
            dispatch(handleUpdateSyncState(initialSyncState))
            dispatch(handleUpdateLocalState(initialLocalState))

            dispatch({ type: START_GAME, gameStarted: true })
        })
        .catch((error) => console.error("Firebase: error setting initial sync state: ", error))    
    }
}

//------------------ Gamestack updates ------------------//

export const UPDATE_GAMESTACK = 'UPDATE_GAMESTACK'

export function listenToGamestackUpdates() {
    return (dispatch, getState) => {
        let { localState } = getState()
        let gameID = localState.gameID
        
        // put a listener on gamestack so we can dispatch updates
        // as soon as we detect any update
        db.ref('/game/' + gameID + '/gameStack').on('value', (snapshot) => {
            let { syncState } = getState()

            // if no changes, just return
            if(syncState.gameStack.length === snapshot.val().length) return

            if(syncState.gameStarted) {
                let action = {
                    type: UPDATE_GAMESTACK,
                    updates: {
                        ...syncState,
                        gameStack: snapshot.val()
                    }
                }

                dispatch(action)
            }
        });
    }
}

//------------------ Set and update cache ------------------//

const SET_CACHE = 'SET_CACHE'

export function cacheLocalState() {
    return (dispatch, getState) => {
        let { localState } = getState()
        let expiryDate = new Date()
        //expiryDate.setMinutes(expiryDate.getMinutes() + 1) // cache is only valid for 1 min
        expiryDate.setMinutes(expiryDate.getMinutes() + 30) 

        localState.expiryTimestamp = expiryDate.getTime()

        localStorage.setItem("localStateCache", JSON.stringify(localState));
        dispatch({ type: SET_CACHE, localState })
    }
}

//------------------ Notifications ------------------//

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