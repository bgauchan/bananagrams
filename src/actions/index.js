
export const SEND_NOTIFICATION = 'SEND_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'

function sendNotification(notification) {
    return { type: SEND_NOTIFICATION, notification }
}

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

function removeNotification(id) {
    return { type: REMOVE_NOTIFICATION, id }
}