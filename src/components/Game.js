import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import GameButtons from "./GameButtons";
import { handleDumpOrMoveTile } from "../actions/localState";

const StyledApp = styled.div`
  background: #fbf6ef;
  display: flex;
  width: 100vw;

  .winning_notice {
    position: fixed;
    top: 10px;
    background: #03a9f4;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    margin: 0;
    color: white;
    padding: 5px 20px;
    border-radius: 10px;
    border: 1px solid #0797d8;
    font-size: 16px;
    text-align: center;
    line-height: 26px;

    span {
      text-transform: capitalize;
    }

    label {
      display: block;
    }
  }
`;

const StyledSidebar = styled.aside`
  background: #f9db5c;
  border-right: 1px solid #e6b242;
  color: #cd9d35;
  display: flex;
  flex-direction: column;
  height: 100vh;
  flex: 0 0 300px;
  margin: 0;
  overflow-y: scroll;

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  img {
    margin-right: 12px;
    width: 30px;
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
`;

const StyledGameArea = styled.main`
  display: flex;
  height: 100vh;
  padding: 35px 0 40px 15px;
  overflow: scroll;
`;

const StyledBoard = styled.ul`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  list-style-type: none;
  padding: 0 30px;

  li {
    border: 1px dotted #e6b242;
    border-radius: 8px;
    cursor: grab;
    font-size: 30px;
    font-weight: bold;
    height: 70px;
    width: 70px;
    margin: 2px;
    position: relative;
  }

  li.is_new {
    border: 1px dotted #2196f3;
  }

  li.is_new:after {
    background: #2196f3;
    border-bottom-left-radius: 4px;
    border-top-right-radius: 4px;
    color: white;
    content: "new";
    font-size: 8px;
    position: absolute;
    right: 0;
    top: 0;
    padding: 1px 4px 2px;
  }

  li.is_new span {
    color: #2196f3;
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
`;
const StyledGameBoard = styled(StyledBoard)`
  justify-content: left;
  min-width: 1750px;

  li {
    border: 1px dotted lightgrey;
    height: 80px;
    width: 80px;
  }

  span {
    color: #e6b242;
  }
`;
const StyledGWinnersameBoard = styled(StyledBoard)`
  background: #fbf6ef;
  justify-content: left;
  min-width: 1750px;

  li {
    border: 1px dotted lightgrey;
    height: 80px;
    width: 80px;

    &.is_new {
      border: 1px dotted lightgrey;

      span {
        color: #e6b242;
      }
    }

    &.is_new:after {
      content: "";
      padding: 0;
    }
  }

  span {
    color: #e6b242;
  }
`;

class Game extends Component {
  componentDidMount() {
    this.centerAlign();
  }
  centerAlign() {
    // use the center tile to center the dropzone area
    let centerTile = document.querySelector(".center_tile");

    if (centerTile) {
      centerTile.scrollIntoView({
        block: "center",
      });
    }
  }
  getClassNames(index, piece) {
    let names = "";

    if (index === 237) {
      names += "center_tile ";
    }

    if (piece && piece.isNew) {
      names += "is_new ";
    }

    return names;
  }
  renderPieceContainer(piece, index, boardName) {
    return (
      <li
        className={this.getClassNames(index, piece)}
        key={index}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => this.handleDrop(e, index, boardName)}
      >
        {piece && (
          <span
            draggable
            onDragStart={(e) =>
              this.handleDragStart(e, piece.order, piece.board)
            }
          >
            {piece.tile}
          </span>
        )}
      </li>
    );
  }
  handleDrop(e, index, targetName) {
    this.props.dispatch(handleDumpOrMoveTile(e, index, targetName));
  }
  handleDragStart(e, order, board) {
    const dt = e.dataTransfer;
    dt.setData("text/plain", order + "_" + board);
    dt.effectAllowed = "move";
  }
  render() {
    let { syncState, localState } = this.props;
    let winningStack = [...Array(440)];
    let winningPlayer = "";

    if (syncState.winningStack) {
      if (syncState.winningPlayer) {
        winningPlayer = syncState.winningPlayer;
      } else {
        winningPlayer = syncState.playStatus.player;
      }

      winningPlayer = winningPlayer.split("_").join(" ");

      syncState.winningStack.map((tile) => (winningStack[tile.order] = tile));
      this.centerAlign();
    }

    return (
      <div>
        {syncState.winningStack ? (
          <StyledApp>
            <h1 className="winning_notice">
              <span>{winningPlayer}</span> called out Bananagrams.
              <label>Here's the board to verify.</label>
            </h1>
            <StyledGWinnersameBoard>
              {winningStack.map((piece, i) =>
                this.renderPieceContainer(piece, i, "solvedStack")
              )}
            </StyledGWinnersameBoard>
          </StyledApp>
        ) : (
          <StyledApp>
            <StyledSidebar>
              <div className="logo">
                <img
                  alt="logo"
                  src="https://cdn-icons-png.flaticon.com/512/1514/1514933.png"
                />
                <h1>Bananagrams</h1>
              </div>
              <StyledBoard>
                {localState.personalStack.map((piece, i) =>
                  this.renderPieceContainer(piece, i, "personalStack")
                )}
              </StyledBoard>
              <div className="dump_zone">
                <span>Dump a Tile here to trade it for 3 tiles</span>
                <StyledBoard>
                  {localState.dumpStack.map((piece, i) =>
                    this.renderPieceContainer(piece, i, "dumpStack")
                  )}
                </StyledBoard>
              </div>
            </StyledSidebar>
            <StyledGameArea>
              <StyledGameBoard>
                {localState.solvedStack.map((piece, i) =>
                  this.renderPieceContainer(piece, i, "solvedStack")
                )}
              </StyledGameBoard>
            </StyledGameArea>

            <GameButtons
              personalStack={localState.personalStack}
              gameStack={syncState.gameStack}
            />
          </StyledApp>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  syncState: state.syncState,
  localState: state.localState,
});

export default connect(
  mapStateToProps
  // mapDispatchToProps
)(Game);
