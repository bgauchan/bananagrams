
import { 
    SEND_NOTIFICATION, 
    REMOVE_NOTIFICATION
} from '../actions'


const notifications = (state = [], action)  => {
    switch (action.type) {
        case SEND_NOTIFICATION:
            return [
                ...state,
                action.notification
            ]        
        case REMOVE_NOTIFICATION:
            let remainingNotifications = state.filter(n => n.id !== action.id)            
            return [...remainingNotifications]
        default:
           return state
    }
}

export default notifications
