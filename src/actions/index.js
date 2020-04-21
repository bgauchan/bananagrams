
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

        // remove notification after 5 seconds
        setTimeout(() => {
            dispatch(removeNotification(notificationID))
        }, 5000);
    }
}

function removeNotification(id) {
    return { type: REMOVE_NOTIFICATION, id }
}