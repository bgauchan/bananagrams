import React, { Component } from 'react'
import { connect } from 'react-redux'
import StartScreen from './components/StartScreen'
import Game from './components/Game'

let totalTiles = 144

class App extends Component {
    state = {
		gameStarted: false
	}
	startGame() {
		let numOfPlayers = 6
		let numOfPersonalTiles = 21
		let numOfGameTiles = totalTiles - (numOfPlayers * numOfPersonalTiles)
		
		if(numOfPlayers > 6) {
			numOfPersonalTiles = 11
			numOfGameTiles = totalTiles - (numOfPlayers * numOfPersonalTiles)
		} else if(numOfPlayers > 4) {
			numOfPersonalTiles = 15
			numOfGameTiles = totalTiles - (numOfPlayers * numOfPersonalTiles)
		}
		
		this.setState({ 
			gameStarted: true,
			numOfPlayers,
			numOfPersonalTiles,
			numOfGameTiles
		})
	}
    componentDidMount() {
		this.startGame()
	}
    render() {
		const { gameStarted } = this.state

        return (
			<div>
				{ !gameStarted ? 
					<StartScreen 
						handleStartGame={() => this.startGame()} /> : 
					<Game 
						numOfPersonalTiles={ this.state.numOfPersonalTiles }
						numOfGameTiles={ this.state.numOfGameTiles }
					/> }
			</div>
		)
    }
}

const mapStateToProps = (state, ownProps) => ({
	selectedSubreddit: state.selectedSubreddit
})

export default connect(
	mapStateToProps,
	// mapDispatchToProps
)(App)
