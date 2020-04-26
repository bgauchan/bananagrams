import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import StartScreen from './components/StartScreen'
import WaitingRoom from './components/WaitingRoom'
import Notification from './components/Notification'
import { handleSetupGame } from './actions'

const StyledNotificationsList = styled.ul`
	display: flex;
	flex-direction: column;
	position: fixed;
	top: 15px;
	right: 25px;
	z-index: 1;

	li {
		background: #03a9f4;
		border-radius: 20px;
		color: white;
		font-size: 14px;
		margin-bottom: 10px;
		min-width: 140px;
		max-width: 240px;
		padding: 10px 15px;
		text-align: center;
	}
`

class App extends Component {
    componentDidMount() {
        this.props.dispatch(handleSetupGame())
    }
    render() {
		let { notifications, syncState, localState } = this.props
		
        return (
			<div>
				{ notifications.length > 0 && (
					<StyledNotificationsList>
						{ notifications.map(notif => (
							<Notification key={notif.id} text={notif.text}></Notification>
						))}
					</StyledNotificationsList>
				)}

				{ syncState.errorMessage ? 
					<h1> { syncState.errorMessage } </h1> : 
					localState.gameID ? <WaitingRoom /> : <StartScreen  />
				}
			</div>
		)
    }
}

const mapStateToProps = (state, ownProps) => ({
	notifications: state.notifications,
	syncState: state.syncState,
	localState: state.localState
})

export default connect(
	mapStateToProps
)(App)
