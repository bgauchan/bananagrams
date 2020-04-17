import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    handleSetupAndStartGame,
} from './actions'
import StartScreen from './components/StartScreen'
import Game from './components/Game'


class App extends Component {
    componentDidMount() {
		this.props.dispatch(handleSetupAndStartGame(5))
	}
    render() {
		let { gameStarted } = this.props.syncState
		
        return (
			<div>
				{ !gameStarted ? 
					<Game 
						numOfPersonalTiles="21"
						numOfGameTiles="52"
					/> : 
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
