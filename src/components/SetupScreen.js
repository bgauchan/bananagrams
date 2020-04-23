import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
// import Game from './Game'
// import { handleStartGame } from '../actions'

const StyledSection = styled.section`
    background: #f9db5c;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;
` 

class SetupScreen extends Component {    
    componentDidMount() {
		// let { dispatch } = this.props
		
		// let numOfPlayers = 5
		// dispatch(handleSetupGame(numOfPlayers))
		// this.startGame()
	}
    render() {
		// let { gameStarted } = this.props.syncState	
        // let { isPlaying } = this.props.localState
        
        return (
            <StyledSection>
                <h1>SETUP SCREEN</h1> 

                {/* { !gameStarted && !isPlaying && (
                    <div>
                        <h1>Waiting on players...</h1>
                        <button onClick={() => this.props.handleStartGame()}>
                            SPLIT
                        </button>
                    </div>
                )}

                { gameStarted && !isPlaying && (
                    <h1>Sorry, the game is already in progress!!</h1> 
                )}

                { gameStarted && isPlaying && <Game /> } */}
            </StyledSection>
          );
    }
}

const mapStateToProps = (state, ownProps) => ({
})

export default connect(
	mapStateToProps,
)(SetupScreen)