
import db from '../firebase'
import { getShuffledTiles } from '../helpers'
import { handleUpdateSyncState, getPersonalStackAfterDumpOrPeel } from './syncState'
import { handleUpdateLocalState, handleRemoveNewStatus } from './localState'

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
                let localStateCache = localStorage.getItem("localStateCache")
                localStateCache = localStateCache ? JSON.parse(localStateCache) : {}
                
                if(localStateCache) {
                    let cacheHasNotExpired = localStateCache.expiryTimestamp > Date.now()
                    let cachedGameID = localStateCache.gameID
                
                    if(cacheHasNotExpired && gameID === cachedGameID) {
                        updatedLocalState = {
                            ...localStateCache,
                            gameID
                        }
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
                updates: {
                    selectedPlayer: playerID,
                    isPlaying: true
                }
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

        // let numOfPersonalTiles = 21 
        let numOfPersonalTiles = 3
	
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

            // Since these personal stack tiles are coming from gamestack, the order of
            // each tile is going to be based on gamestack (so like it could be 22, 45, etc.).
            // Therefore, we need to reset each tile in the extracted personal stack to be
            // from 0-21 so it won't cause bugs later on
            personalStack.forEach((tile, index) => tile.order = index)
            
            // stack for the current player
            if(p.playerID === localState.selectedPlayer) {
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
            gameStarted: true,
            notifications: []
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

//------------------ Listeners ------------------//

export const UPDATE_GAMESTACK = 'UPDATE_GAMESTACK'
export const UPDATE_SELECTED_PLAYERS = 'UPDATE_SELECTED_PLAYERS'

export function handleSetUpListeners() {
    return (dispatch, getState) => {
        let { localState } = getState()
        let gameID = localState.gameID

        dispatch(listenToPlayStatus(gameID))
        dispatch(listenToPlayersUpdates(gameID))
        dispatch(listenToGameStarted(gameID))
        dispatch(listenToNotifications(gameID))
        dispatch(listenToGamestackUpdates(gameID))
    }
}

export function listenToPlayStatus(gameID) { 
    return (dispatch, getState) => {
        let onLoad = true

        // put a listener on settings ref so we can dispatch updates
        // as soon as we detect any update
        db.ref('/game/' + gameID + '/playStatus').on('value', function(snapshot) {
            let { syncState } = getState()            
            let updates = snapshot.val()

            if(syncState.gameStarted && !onLoad) {
                switch(updates.status) {
                    case 'peel':
                        dispatch(handlePeelTile())
                        break
                    default:
                        break
                }
            }

            onLoad = false
        })
    }
}

export function listenToPlayersUpdates(gameID) { 
    return (dispatch, getState) => {
        // put a listener on settings ref so we can dispatch updates
        // as soon as we detect any update
        db.ref('/game/' + gameID + '/players').on('value', function(snapshot) {
            let players = snapshot.val()
            let { localState } = getState()

            if(!players) return

            dispatch({
                type: UPDATE_SELECTED_PLAYERS,
                players
            })

            // if personal stack is already setup, move on
            if(localState.personalStack.length < 1) {
                let personalStack = [] 

                players.forEach((p) => {
                    // stack for the current player
                    if(p.playerID === localState.selectedPlayer) {
                        personalStack = p.personalStack ? p.personalStack : []
                    }
                })

                dispatch(handleUpdateLocalState({personalStack}))
            }
        });
    }
}

function listenToGameStarted(gameID) {
    return (dispatch) => {
        // put a listener on notifications so we can dispatch updates
        // as soon as we detect any update
        db.ref('/game/' + gameID + '/gameStarted').on('value', (snapshot) => {
            let updates = { gameStarted: snapshot.val() }
            dispatch(handleUpdateSyncState(updates))
        })
    }
}

function listenToNotifications(gameID) {
    return (dispatch, getState) => {
        // put a listener on notifications so we can dispatch updates
        // as soon as we detect any update
        db.ref('/game/' + gameID + '/notifications').on('value', (snapshot) => {
            let { syncState } = getState()
            let notifications = snapshot.val()

            // only show notifications that are not older than 30 seconds
            let notificationsToShow =  notifications ? notifications.filter((n) => (Date.now() - n.date) < 30000) : []  

            if(syncState.gameStarted && notificationsToShow.length > 0) {                
                notificationsToShow.forEach(notification => {
                    dispatch(sendNotification(notification))
    
                    // remove notification after 4 seconds
                    setTimeout(() => {
                        dispatch(removeNotification(notification.date))
                    }, 4000);
                })
            }
        })
    }
}

function listenToGamestackUpdates(gameID) {
    return (dispatch, getState) => {
        // put a listener on gamestack so we can dispatch updates
        // as soon as we detect any update
        db.ref('/game/' + gameID + '/gameStack').on('value', (snapshot) => {
            dispatch(handleUpdateSyncState({ gameStack: snapshot.val() }))
        })
    }
}

//------------------ Update play status ------------------//

export const UPDATE_PLAY_STATUS = 'UPDATE_PLAY_STATUS'

export function handleUpdatePlayStatus(status) {
    return (dispatch, getState) => {        
        let { localState } = getState()

        db.ref('/game/' + localState.gameID + '/playStatus').set(status)
        .catch((error) => console.error("Firebase: error adding document: ", error))  
    }
}

//------------------ Peel tile ------------------//

export const PEEL_TILE = 'PEEL_TILE'

export function handlePeelTile() {
    return (dispatch, getState) => {
        let { localState, syncState } = getState()
        let gameID = localState.gameID
        let numOfPlayers = syncState.players.length

        let updatedGameStack = syncState.gameStack

        // give each player a tile, which means we should remove
        // tiles equal to the number of players
        updatedGameStack.splice(0, numOfPlayers)
        
        db.ref('/game/' + gameID + '/gameStack').set(updatedGameStack)
        .then(() => {
            dispatch(handleSendNotification({
                type: 'peel',
                text: `${localState.selectedPlayer} called Peel!`
            }))

            let updatedPersonalStack = getPersonalStackAfterDumpOrPeel(localState.personalStack, 1)

            let updatedLocalState = {
                ...localState,
                personalStack: updatedPersonalStack
            }

            dispatch(handleUpdateLocalState(updatedLocalState))

            // remove new status from tiles in personal stack after 5s
            setTimeout(() => {
                dispatch(handleRemoveNewStatus())
            }, 5000);
        })
        .catch((error) => console.error("Firebase: error adding document: ", error))  
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
        let { localState } = getState()
        let notificationID = Date.now()
        notification.date = notificationID

        db.ref('/game/' + localState.gameID + '/notifications').transaction((prevNotifications) => {
            let updatedNotifications = []
            
            if(prevNotifications === null) {
                updatedNotifications = [notification]
            } else {
                // remove any notifications that have been there for more than 30 seconds
                updatedNotifications = prevNotifications.filter((n) => (Date.now() - n.date) < 30000)
                updatedNotifications.push(notification)
            }

            return updatedNotifications
        })
        .catch((error) => console.error("Firebase: error setting initial sync state: ", error))  
    }
}

export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

export function removeNotification(date) {
    return (dispatch, getState) => {   
        let { syncState } = getState() 
        let remainingNotifications = syncState.notifications.filter(n => n.date !== date) 
        dispatch({ type: REMOVE_NOTIFICATION, notifications: remainingNotifications })
    }
}