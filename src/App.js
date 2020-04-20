import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleInitializeSyncState } from './actions/syncState'
import { handleInitializeLocalState } from './actions/localState'
import StartScreen from './components/StartScreen'
import Game from './components/Game'


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
		
        return (
			<div>
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
	syncState: state.syncState,
})

export default connect(
	mapStateToProps
)(App)
