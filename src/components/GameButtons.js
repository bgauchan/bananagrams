import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { handleUpdatePlayStatus } from '../actions'

const StyledButtonsArea = styled.section`
    background: white;
    border: 1px solid #e6b242;
    border-radius: 12px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: fixed;
    bottom: 0;
    right: calc(50% - 336px);
    padding: 18px 12px 20px 16px;
    width: 380px;

    h4 {
        margin: 0;
    }
    
    .highlight {
        color: #03a9f4;
        font-size: 22px;
        margin: 0 0 0 5px;
        position: relative;
        top: 1px;
    }

    .buttons {
        display: flex;
        justify-content: space-around;
        width: 100%;
    }

	.buttons button {
		background: #ff7272;
        border-radius: 10px;
        color: white;
		display: flex;
		align-items: center;
        font-size: 16px;
        font-weight: bold;
		justify-content: center;
		height: 40px;
        width: auto;
        margin: 20px 0 0;
        padding: 0 25px;
    }

    button:hover {
        background: #f75d5d;
    }

    button.bananagrams_btn {
        background: #f9db5b;
        border: 2px solid #e6b242;
        color: #a9802a;
    }

    button.bananagrams_btn:hover {
        background: #ffe46f;
    }
    
    img {
        margin-right: 10px;
        width: 28px;
    }

    img.winner {
        height: 22px;
        width: 20px;
    }
` 

class GameButtons extends Component {    
    peel() {
        let status = {
            timestamp: Date.now(),
            status: 'peel',
            data: `${this.props.localState.selectedPlayer} called Peeeeel!`
        }

        this.props.dispatch(handleUpdatePlayStatus(status))
    }
    render() {
        // hide peel button and show plantaingrams button if the user's
        // personal stack is empty
        let enableButtons = this.props.personalStack.every(t => t === undefined || t === null)
        
        return (
            <StyledButtonsArea>
                <h4>
                    Tiles left in the stack: 
                    <span className="highlight">
                        { this.props.gameStack ? this.props.gameStack.length : 0 }
                    </span>
                </h4>

                <div className="buttons">
                    <button className="peel_btn" disabled={!enableButtons} onClick={() => this.peel()}>
                        <img alt="peel" src="https://image.flaticon.com/icons/svg/1012/1012787.svg" />
                        <span>Peel</span>
                    </button>
                    <button className="bananagrams_btn" disabled={!enableButtons}>
                        <img alt="peel" className="winner"
                            src="https://image.flaticon.com/icons/svg/2293/2293014.svg" />
                        <span>Bananagrams!!</span>
                    </button>
                </div>
            </StyledButtonsArea>
          );
    }
}

const mapStateToProps = (state, ownProps) => ({
	syncState: state.syncState,
	localState: state.localState
})

export default connect(
	mapStateToProps,
)(GameButtons)