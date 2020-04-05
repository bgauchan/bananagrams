import React, { Component } from 'react'
import { connect } from 'react-redux'
import StartScreen from './components/StartScreen'
import Game from './components/Game'

class App extends Component {
    state = {
		gameStarted: false
	}
	startGame() {
		this.setState({ gameStarted: true })
	}
    render() {
		const { gameStarted } = this.state

        return (
			<div>
				{ !gameStarted ? 
					<StartScreen 
						handleStartGame={() => this.startGame()} /> : 
					<Game /> }
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
