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

	.dump_zone {
		border-top: 1px solid #efc876;
		border-bottom: 1px solid #efc876;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 35px 0;
		padding: 30px;

		li {
			border: 2px dotted white;
			height: 70px;
			width: 70px;
		}

		span {
			font-size: 20px;
			font-weight: bold;
			max-width: 120px;
		}
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
    justify-content: flex-start;
    flex-wrap: wrap;
	list-style-type: none;
	padding: 0 25px;

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
	
	li span {
		color: #e6b242;
		font-size: 24px;
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

	span {
		color: #e6b242;
	}
`

class Game extends Component {
    componentDidMount() {
        // use the center tile to center the dropzone area
		let centerTile = document.querySelector('.center_tile');
		
		if(centerTile) {
			centerTile.scrollIntoView({
				block: 'center',
			});
		}
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
		let { localState } = this.props

		// if you're dropping at the spot where a tile is already there, 
		// do nothing
        let targetStack = localState[targetName];
        if (targetStack[index]) return;

		// get the order of the tile dropped and the original board it was in
		// (comes in as 'order_board' format)
		const originOrderAndStack = e.dataTransfer.getData('text').split('_')
		let originOrder = originOrderAndStack[0]
		let originStackName = originOrderAndStack[1]
		let originTile = localState[originStackName].find(p => p && (p.order === +originOrder))

		// since we dragged it out, remove it from the original stack
		let originStack = localState[originStackName]
		originStack[originOrder] = undefined	

		// add it to new stack with update info like the new order in target stack
		// and the board as well
		targetStack[index] = {
			...originTile,
			order: index,
			board: targetName
		}

		debugger

		// Next Step: add action creators for updating stacks after dropping

		if(targetName === 'dumpStack') {
			// if its a tile being dumped, take 3 tiles from game stack
			// and put it in personal stack AND take the dumped tile, and
			// put it in the game stack		
			let extraThreeTiles = this.getShuffledPieces(3, true)
			let updatedPersonalStack = this.getPersonalStackAfterDump(extraThreeTiles)
			
			this.setState({ 
				[originStackName]: originStack,
				[targetName]: targetStack,
				personalStack: updatedPersonalStack
			})
		} else {		
			this.setState({ 
				[originStackName]: originStack,
				[targetName]: targetStack
			})
		}
    }
    handleDragStart(e, order, board) {
        const dt = e.dataTransfer
        dt.setData('text/plain', (order + '_' + board))
        dt.effectAllowed = 'move'
	}
	getPersonalStackAfterDump(extraThreeTiles) {		
		let updatedStack = this.state.personalStack.map((tile, index) => {
			// if there are empty slots, fill those up first
			if(tile === undefined && extraThreeTiles.length > 0) {
				return extraThreeTiles.shift() // take one of the extra tiles
			} else {
				return tile
			}
		})
		
		// if all the 3 extra tiles haven't been swapped in, add them to the end
		if(extraThreeTiles.length > 0) {
			updatedStack = [...updatedStack, ...extraThreeTiles]
		}
		
		return updatedStack
	}
    render() {
		let { syncState, localState } = this.props

        return (
            <StyledApp>
				<StyledSidebar>
					<div className="logo">
						<img alt='logo' src='https://image.flaticon.com/icons/svg/575/575393.svg' />
						<h1>Plantaingrams</h1>
					</div>
					<StyledBoard>
						{ localState.personalStack.map((piece, i) => this.renderPieceContainer(piece, i, 'personalStack')) }
					</StyledBoard>
					<div className="dump_zone">
						<span>Dump a Tile here to trade it for 3 tiles</span>
						<StyledBoard>
							{ localState.dumpStack.map((piece, i) => this.renderPieceContainer(piece, i, 'dumpStack')) }
						</StyledBoard>
					</div>
				</StyledSidebar>
				<StyledGameArea>
					<StyledGameBoard>
						{ localState.solvedStack.map((piece, i) => this.renderPieceContainer(piece, i, 'solvedStack')) }
					</StyledGameBoard>
				</StyledGameArea>

				<GameButtons 
					personalStack={localState.personalStack} 
					gameStack={syncState.gameStack} 
				/>
            </StyledApp>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
	syncState: state.syncState,
	localState: state.localState
})

export default connect(
	mapStateToProps,
	// mapDispatchToProps
)(Game)