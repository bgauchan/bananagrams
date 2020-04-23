import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { handleCreateGame } from '../actions'

const StyledSection = styled.section`
    background: #f9db5c;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100vh;

    .bananagram {
        display: flex;
        margin-top: 20px;
    }

    .bananagram span {
        background: #fbf6ef;
        box-shadow: 0 0 0 1px #f1d63b inset, 0 0 0 2px rgba(255,255,255,0.10) inset, 0 6px 0 0 #c7ba40, 0 8px 8px 1px rgba(0,0,0,.2);
        border-radius: 8px;
        color: #e6b242;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        height: 60px;
        width: 60px;
        margin: 0 3px;
    }

    button {
		background: #ff7272;
        border-radius: 10px;
        color: white;
        font-size: 20px;
        font-weight: bold;
        margin-top: 40px;
        padding: 10px 20px;
    }

    a {
        color: #8e6c06;
        margin-top: 30px;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
` 

class StartScreen extends Component {
	createGame() {
		this.props.dispatch(handleCreateGame())
	}
    render() {
        return (
            <StyledSection>
                <h1>LETS PLAY</h1>
                <div className="bananagram">
                    <span>B</span>
                    <span>A</span>
                    <span>N</span>
                    <span>A</span>
                    <span>N</span>
                    <span>A</span>
                    <span>G</span>
                    <span>R</span>
                    <span>A</span>
                    <span>M</span>
                    <span>S</span>
                </div>
                <button onClick={() => this.createGame()}>
                    New Game
                </button>
                <a href="https://bananagrams.com/blog/how-to-play-bananagrams-instructions-for-getting-started" 
                    target="_blank" rel="noopener noreferrer">
                    Read the rules
                </a>
            </StyledSection>
          );
    }
}

const mapStateToProps = (state, ownProps) => ({
})

export default connect(
	mapStateToProps,
	// mapDispatchToProps
)(StartScreen)