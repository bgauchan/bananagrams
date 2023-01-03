import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Game from "./Game";
import {
  handleSelectPlayer,
  handleStartGame,
  handleSetUpListeners,
} from "../actions";

const StyledSection = styled.section`
  background: #f9db5c;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;

  .container {
    text-align: center;
  }

  .players {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
    width: 80vw;
    max-width: 1080px;
  }

  .players li {
    background: white;
    color: #562d18;
    cursor: pointer;
    border: 2px solid #f1e097;
    filter: grayscale(1);
    padding: 14px 10px 10px;
    border-radius: 10px;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 0 0 115px;
    margin: 10px;
    position: relative;
    transition: transform 100ms linear;

    i {
      color: #ff7272;
      font-size: 40px;
      margin: 5px 0 15px;
    }
  }

  .players li:hover {
    border: 2px solid #b56237;
    filter: drop-shadow(2px 4px 6px #562d18);
    transform: translateY(-6px);
  }

  .players li.active,
  .players li.selected {
    filter: unset;
    pointer-events: none;
  }

  .players li.selected:after {
    content: "PICKED";
    border-radius: 8px;
    height: 100%;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .players li.active:after {
    content: "";
    background-image: url(https://image.flaticon.com/icons/svg/575/575393.svg);
    border: 2px solid #562d18;
    border-radius: 8px;
    height: 100%;
    position: absolute;
    width: 100%;
    background-size: 40px;
    background-position: center;
    bottom: 0px;
    right: 0;
    background-repeat: no-repeat;
    background-color: rgba(0, 0, 0, 0.6);
  }

  .players img {
    display: block;
    height: 50px;
    width: 50px;
    margin-bottom: 10px;
    transition: filter 500ms linear;
  }

  .players span {
    font-size: 14px;
    font-weight: bold;
  }

  h2 {
    margin-bottom: 30px;
  }

  .selected_player {
    text-transform: capitalize;
    background: #03a9f4;
    padding: 5px 10px;
    border-radius: 8px;
    color: white;
    font-size: 20px;
  }

  button,
  .go_home_btn {
    background: #ff7272;
    border: 2px solid #dc6767;
    border-radius: 10px;
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin-top: 40px;
    padding: 10px 20px;

    i {
      margin-right: 8px;
      transform: translateY(2px);
    }
  }

  button:disabled {
    filter: grayscale(1);
    pointer-events: none;
  }

  .go_home_btn {
    display: flex;
    align-times: center;
    font-size: 18px;
    margin: 0;
    position: fixed;
    left: 15px;
    top: 15px;
    text-decoration: none;
  }

  .go_home_btn:hover {
    background: #ef6a6a;
  }

  .go_home_btn img {
    margin-right: 10px;
    width: 22px;
  }
`;

class WaitingRoom extends Component {
  state = {
    selectedPlayer: "",
  };
  componentDidMount() {
    this.props.dispatch(handleSetUpListeners());
  }
  startGame() {
    this.props.dispatch(handleStartGame());
  }
  selectPlayer(playerID) {
    if (!this.state.selectedPlayer) {
      this.setState({ selectedPlayer: playerID });
      this.props.dispatch(handleSelectPlayer(playerID));
    }
  }
  getClassNames(playerID) {
    let { players } = this.props.syncState;
    let classes = "";

    if (players && players.find((p) => p.playerID === playerID)) {
      classes += "selected ";
    }

    if (this.state.selectedPlayer === playerID) {
      classes += "active ";
    }

    return classes;
  }
  render() {
    let { gameStarted } = this.props.syncState;
    let { isPlaying } = this.props.localState;

    let selectedPlayerName = this.state.selectedPlayer;
    selectedPlayerName = selectedPlayerName.split("_").join(" ");

    return (
      <StyledSection>
        {gameStarted && isPlaying && <Game />}

        {gameStarted && !isPlaying && (
          <h1>Sorry, the game is already in progress!!</h1>
        )}

        {!gameStarted && (
          <div className="container">
            <a href="/" className="go_home_btn">
              <i className="fa-solid fa-circle-arrow-left"></i>
              <span>Go Home</span>
            </a>

            <h1>Waiting For Players...</h1>

            {selectedPlayerName ? (
              <h2>
                You picked:{" "}
                <span className="selected_player">{selectedPlayerName}</span>
              </h2>
            ) : (
              <h2>Pick a character</h2>
            )}

            <ul className="players">
              <li
                onClick={() => this.selectPlayer("creature")}
                className={this.getClassNames("creature")}
              >
                <i className="fa-solid fa-hippo"></i>
                <span>Creature</span>
              </li>
              <li
                onClick={() => this.selectPlayer("pix6_gen")}
                className={this.getClassNames("pix6_gen")}
              >
                <i className="fa-solid fa-otter"></i>
                <span>Pix6 Gen</span>
              </li>
              <li
                onClick={() => this.selectPlayer("panlo")}
                className={this.getClassNames("panlo")}
              >
                <i className="fa-solid fa-frog"></i>
                <span>Panlo</span>
              </li>
              <li
                onClick={() => this.selectPlayer("telly")}
                className={this.getClassNames("telly")}
              >
                <i className="fa-solid fa-dove"></i>
                <span>Telly</span>
              </li>
              <li
                onClick={() => this.selectPlayer("kb")}
                className={this.getClassNames("kb")}
              >
                <i className="fa-solid fa-cat"></i>
                <span>KB</span>
              </li>
              <li
                onClick={() => this.selectPlayer("yung_thug")}
                className={this.getClassNames("yung_thug")}
              >
                <i className="fa-solid fa-horse"></i>
                <span>Yung Thug</span>
              </li>
              <li
                onClick={() => this.selectPlayer("dan_g")}
                className={this.getClassNames("dan_g")}
              >
                <i className="fa-solid fa-fish"></i>
                <span>Dan G</span>
              </li>
              <li
                onClick={() => this.selectPlayer("mikey_tubbies")}
                className={this.getClassNames("mikey_tubbies")}
              >
                <i className="fa-solid fa-dog"></i>
                <span>Mikey Tubbies</span>
              </li>
            </ul>

            <button
              disabled={selectedPlayerName ? "" : "disabled"}
              onClick={() => this.startGame()}
            >
              SPLIT
            </button>
          </div>
        )}
      </StyledSection>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    syncState: state.syncState,
    localState: state.localState,
  };
};

export default connect(mapStateToProps)(WaitingRoom);
