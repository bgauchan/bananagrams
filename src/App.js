import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { handleInitializeSyncState } from './actions/syncState'
import { handleInitializeLocalState } from './actions/localState'
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import Notification from './components/Notification'

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
		let { dispatch } = this.props
		
		let numOfPlayers = 5
		let totalTiles = 144
		let numOfPersonalTiles = 21
		let numOfGameTiles = totalTiles - (numOfPlayers * numOfPersonalTiles)
	
		if(numOfPlayers > 6) {
			numOfPersonalTiles = 11
			numOfGameTiles = totalTiles - (numOfPlayers * numOfPersonalTiles)
		} else if(numOfPlayers > 4) {
			numOfPersonalTiles = 15
			numOfGameTiles = totalTiles - (numOfPlayers * numOfPersonalTiles)
		}

		dispatch(handleInitializeSyncState(numOfPlayers, numOfPersonalTiles, numOfGameTiles))
		dispatch(handleInitializeLocalState(numOfPersonalTiles))
	}
    render() {
		let { gameStarted } = this.props.syncState	
		let notifications = this.props.notifications	
		
        return (
			<div>
				{ notifications.length > 0 && (
					<StyledNotificationsList>
						{ notifications.map(notif => (
							<Notification key={notif.id} text={notif.text}></Notification>
						))}
					</StyledNotificationsList>
				)}

				{ gameStarted ? 
					<Game /> : 
					<StartScreen 
						handleStartGame={() => this.startGame()} /> 
				}
			</div>
		)
    }
}

const mapStateToProps = (state, ownProps) => ({
	notifications: state.notifications,
	syncState: state.syncState,
})

export default connect(
	mapStateToProps
)(App)
