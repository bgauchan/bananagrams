import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import GameButtons from './GameButtons'

const StyledApp = styled.div`
	background: #fbf6ef;
	display: flex;
`

const StyledSidebar = styled.aside`
	background: #f9db5c;
	border-right: 1px solid #e6b242;
	color: #e6b242;
	display: flex;
	flex-direction: column;
	height: 100vh;
	flex: 0 0 276px;
	margin: 0;
	overflow-y: scroll;

	.logo {	
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20px;
	}

	img {
		margin-right: 15px;
		width: 34px;
	}

	h1 {
		display: inline-block;
		margin: 0;
	}
`

const StyledGameArea = styled.main`
	display: flex;
	height: 100vh;
	padding: 40px;
	overflow: scroll;
`

const StyledBoard = styled.ul`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    list-style-type: none;

    li {
        border: 1px dotted #e6b242;
        border-radius: 8px;
        cursor: grab;
        font-size: 30px;
        font-weight: bold;
        height: 70px;
        width: 70px;
        margin: 2px;
    }

    span {
        background: white;
        border: 1px solid #e6b242;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
    }
` 
const StyledGameBoard = styled(StyledBoard)`
	justify-content: left;
	min-width: 1940px;

	li {
        border: 1px dotted lightgrey;
        height: 80px;
        width: 80px;
	}

	span {;
		color: #e6b242;
	}
`

const pieces = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

class Game extends Component {
    constructor(props) {
		super(props)
		
		this.state = {
			personalStack: this.getShuffledPieces(this.props.numOfPersonalTiles),
			gameStack: this.getShuffledPieces(this.props.numOfGameTiles),
			solved: [...Array(360)]
		}
    }
    componentDidMount() {
        // use the center tile to center the dropzone area
		let centerTile = document.querySelector('.center_tile');
		
		if(centerTile) {
			centerTile.scrollIntoView({
				block: 'center',
			});
		}
	}
	getShuffledPieces(count) {
		let shuffledPieces = []

        for(let i = 0; i < count; i++) {
			let randomIndex = Math.floor(Math.random() * 25) + 1
			shuffledPieces.push({
				tile: pieces[randomIndex],
				order: i,
				board: 'personalStack'
			})
		}

		return shuffledPieces
	}
    renderPieceContainer(piece, index, boardName) {
        return (
            <li
				className={ index === 194 ? 'center_tile' : '' }
                key={index}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => this.handleDrop(e, index, boardName)}>
                {
                    piece && 
					<span
                        draggable
                        onDragStart={(e) => this.handleDragStart(e, piece.order, piece.board)}>
							{ piece.tile }
					</span>
                }
            </li>
        );
    }
    handleDrop(e, index, targetName) {
		// if you're dropping at the spot where a tile is already there, 
		// do nothing
        let targetStack = this.state[targetName];
        if (targetStack[index]) return;

		// get the order of the tile dropped and the original board it was in
		// (comes in as 'order_board' format)
		const originOrderAndStack = e.dataTransfer.getData('text').split('_')
		let originOrder = originOrderAndStack[0]
		let originStackName = originOrderAndStack[1]
		let originTile = this.state[originStackName].find(p => p && (p.order === +originOrder))

		// since we dragged it out, remove it from the original stack
		let originStack = this.state[originStackName]
		originStack[originOrder] = undefined	
	
		// add it to new stack with update info like the new order in target stack
		// and the board as well
		targetStack[index] = {
			...originTile,
			order: index,
			board: targetName
		}
	
		this.setState({ 
			[originStackName]: originStack,
			[targetName]: targetStack
		})
    }
    handleDragStart(e, order, board) {
        const dt = e.dataTransfer
        dt.setData('text/plain', (order + '_' + board))
        dt.effectAllowed = 'move'
	}
    render() {
        return (
            <StyledApp>
				<StyledSidebar>
					<div className="logo">
						<img alt='logo' src='https://image.flaticon.com/icons/svg/575/575393.svg' />
						<h1>Plantaingrams</h1>
					</div>
					<StyledBoard>
						{ this.state.personalStack.map((piece, i) => this.renderPieceContainer(piece, i, 'personalStack')) }
					</StyledBoard>
				</StyledSidebar>
				<StyledGameArea>
					<StyledGameBoard>
						{this.state.solved.map((piece, i) => this.renderPieceContainer(piece, i, 'solved'))}
					</StyledGameBoard>
				</StyledGameArea>

				<GameButtons 
					personalStack={this.state.personalStack} 
					gameStack={this.state.gameStack} 
				/>
            </StyledApp>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
})

export default connect(
	mapStateToProps,
	// mapDispatchToProps
)(Game)