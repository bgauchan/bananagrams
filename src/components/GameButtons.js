import React, { Component } from 'react'
import styled from 'styled-components'

const StyledButtonsArea = styled.section`
    background: white;
    border: 1px solid #e6b242;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 25px;
    right: 25px;
    padding: 10px 12px 10px 16px;

    h4 {
        margin: 0;
    }
    
    .highlight {
        color: orange;
        font-size: 22px;
        margin: 0 20px 0 5px;
        position: relative;
        top: 1px;
    }

	button {
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
        padding: 0 25px;
    }

    button:hover {
        background: #f75d5d;
    }
    
    img {
        margin-right: 5px;
        width: 30px;
    }

    img.winner {
        height: 22px;
        width: 20px;
    }
` 

class GameButtons extends Component {    
    render() {
        // hide peel button and show plantaingrams button if the user's
        // personal stack is empty
        let hidePeelButton = this.props.personalStack.every(t => t === undefined)

        return (
            <StyledButtonsArea>
                <h4>
                    Tiles left in the stack: 
                    <span className="highlight">
                        { this.props.gameStack ? this.props.gameStack.length : 0 }
                    </span>
                </h4>

                { !hidePeelButton && ( 
                    <button>
                        <img alt="peel" src="https://image.flaticon.com/icons/svg/1012/1012787.svg" />
                        <span>PEEL</span>
                    </button>
                )}

                { hidePeelButton && ( 
                    <button>
                        <img alt="peel" className="winner"
                            src="https://image.flaticon.com/icons/svg/2293/2293014.svg" />
                        <span>PLATAINGRAMS!!</span>
                    </button>
                )}
                
            </StyledButtonsArea>
          );
    }
}

export default GameButtons