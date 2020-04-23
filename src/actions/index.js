
import db from '../firebase'
import { getShuffledtiles } from '../helpers'

export const CREATE_GAME = 'CREATE_GAME'
export const SETUP_GAME = 'SETUP_GAME'
export const SETUP_GAME_FROM_SERVER = 'SETUP_GAME_FROM_SERVER'
export const ERROR_NO_GAME = 'ERROR_NO_GAME'
export const SEND_NOTIFICATION = 'SEND_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

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

function sendNotification(notification) {
    return { type: SEND_NOTIFICATION, notification }
}

export function handleSendNotification(notification) {
    debugger
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

function removeNotification(id) {
    return { type: REMOVE_NOTIFICATION, id }
}