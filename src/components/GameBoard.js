import React, { useState } from 'react';
import PlayerBoard from './PlayerBoard';
import gameController from '../modules/gameController';
import createGameBoard from '../modules/createGameBoard';

function GameBoard() {
  const [gameStart, setGameStart] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [playerBoard, setPlayerBoard] = useState(createGameBoard());
  const [computerBoard, setComputerBoard] = useState(createGameBoard());
  const [isLastComputerMoveHit, setIsLastComputerMoveHit] = useState(false);
  const changeablePlayerBoard = { ...playerBoard };
  const changeableComputerBoard = { ...computerBoard };

  const handleStartRestartButton = () => {
    if (playerBoard.ships.length !== 5) return;

    if (gameStart) {
      changeablePlayerBoard.resetBoard();
      setPlayerBoard(changeablePlayerBoard);

      changeableComputerBoard.resetBoard();
      setComputerBoard(changeableComputerBoard);
      setGameOver(false);
      setIsLastComputerMoveHit(false);
    } else {
      gameController.randomizeShipLocations(changeableComputerBoard);
      setComputerBoard(changeableComputerBoard);
      setGameOver(false);
      setIsLastComputerMoveHit(false);
    }

    setGameStart(!gameStart);
  };

  const handleRandomizeButton = () => {
    gameController.randomizeShipLocations(changeablePlayerBoard);
    setPlayerBoard(changeablePlayerBoard);
  };

  const checkForSunkShips = (changeableBoard, setBoard) => {
    changeableBoard.ships.forEach((ship) => {
      if (ship.details.isSunk()) {
        ship.coordinates.forEach((coordinate, index) => {
          const { x, y } = coordinate;

          if (ship.direction === 'u') {
            if (index === 0) {
              changeableBoard.missedHits.push({ x: x, y: y - 1 });
            } else if (index === ship.coordinates.length - 1) {
              changeableBoard.missedHits.push({ x: x, y: y + 1 });
            }
            changeableBoard.missedHits.push({ x: x + 1, y: y });
            changeableBoard.missedHits.push({ x: x - 1, y: y });
          } else if (ship.direction === 'r') {
            if (index === 0) {
              changeableBoard.missedHits.push({ x: x - 1, y: y });
            } else if (index === ship.coordinates.length - 1) {
              changeableBoard.missedHits.push({ x: x + 1, y: y });
            }

            changeableBoard.missedHits.push({ x: x, y: y + 1 });
            changeableBoard.missedHits.push({ x: x, y: y - 1 });
          }
        });
      }
    });
    setBoard(changeableBoard);
  };

  const computerAttack = () => {
    const compMove = gameController.computerMove(changeablePlayerBoard, isLastComputerMoveHit);

    if (compMove) {
      setIsLastComputerMoveHit(true);
    }

    setPlayerBoard(changeablePlayerBoard);
  };

  const handlePlayerAttack = (coordinate) => {
    if (gameOver) return;

    const parsedCoordinate = JSON.parse(coordinate);
    const isValidMove = gameController.playerMove(
      changeableComputerBoard,
      parsedCoordinate.x,
      parsedCoordinate.y
    );
    setComputerBoard(changeableComputerBoard);

    if (isValidMove === null) return;
    if (changeableComputerBoard.allShipsSunk()) {
      setGameOver(true);
      setWinner('You Win');
    }

    computerAttack();

    if (changeablePlayerBoard.allShipsSunk()) {
      setGameOver(true);
      setWinner('The Enemy has Won');
    }

    checkForSunkShips(changeablePlayerBoard, setPlayerBoard);
    checkForSunkShips(changeableComputerBoard, setComputerBoard);
  };

  return (
    <div className="gameBoard">
      <h1>Battleship</h1>
      <h2 className={winner === 'You Win' ? 'winPlayer' : 'winComputer'}>{gameOver && winner}</h2>
      <div className="playerBoards">
        <PlayerBoard
          title={'Your Board'}
          computerBoard={false}
          gameStart={gameStart}
          ships={playerBoard.ships}
          missedHits={playerBoard.missedHits}
          successfulHits={playerBoard.successfulHits}
        />
        {gameStart && (
          <PlayerBoard
            title={'Enemy Board'}
            computerBoard={true}
            gameStart={gameStart}
            gameOver={gameOver}
            ships={computerBoard.ships}
            missedHits={computerBoard.missedHits}
            successfulHits={computerBoard.successfulHits}
            handlePlayerAttack={handlePlayerAttack}
          />
        )}
      </div>
      <div className="buttons">
        <button
          onClick={handleStartRestartButton}
          className={playerBoard.ships.length !== 5 ? 'buttonOff' : ''}
        >
          {gameStart ? 'Restart Game' : 'Start Game'}
        </button>
        {!gameStart && <button onClick={handleRandomizeButton}>Randomize Locations</button>}
      </div>
    </div>
  );
}

export default GameBoard;
