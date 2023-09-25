import React, { useState, useEffect } from 'react';
import './board.css';

const boardSize = 10;
const wumpusArray = [];
const goldArray = [];
const goldNo = 5; // Define the number of gold
const wumpusNo = 3; // Define the number of wumpus
const pitNo = 4; // Define the number of pits

const posToDivID = (inX, inY) => {
  const retV = inX * 10 + inY;
  return retV < 10 ? `0${retV}` : retV.toString();
};

function App() {
  const [myPos, setMyPos] = useState({ x: 0, y: 0 });
  const [foundGold, setFoundGold] = useState(0);
  const [score, setScore] = useState(100);
  const [boardView, setBoardView] = useState([]);

  useEffect(() => {
    const initializeBoardView = () => {
      const newBoardView = Array.from({ length: boardSize }, () => Array(boardSize).fill('n'));
      setBoardView(newBoardView);
    };

    const getIndexFromNumber = (num) => ({
      x: Math.floor(num / 10),
      y: num % 10
    });

    const setWumpus = () => {
      const updatedBoardView = [...boardView];

      for (let i = 0; i < wumpusNo;) {
        const x = Math.floor(Math.random() * 100) + 1;
        const { x: rowIndex, y: colIndex } = getIndexFromNumber(x);

        if (
          !wumpusArray.includes(x) &&
          x !== 2 &&
          x !== 11 &&
          updatedBoardView[rowIndex] !== undefined &&
          updatedBoardView[rowIndex][colIndex] !== undefined
        ) {
          updatedBoardView[rowIndex][colIndex] = 'w'; // Set the wumpus cell

          // Update stench cells
          if (rowIndex > 0) updatedBoardView[rowIndex - 1][colIndex] = 's';
          if (rowIndex < boardSize - 1) updatedBoardView[rowIndex + 1][colIndex] = 's';
          if (colIndex > 0) updatedBoardView[rowIndex][colIndex - 1] = 's';
          if (colIndex < boardSize - 1) updatedBoardView[rowIndex][colIndex + 1] = 's';

          wumpusArray.push(x);
          i++;
        }
      }

      setBoardView(updatedBoardView);
    };

    const setGold = () => {
      const newBoardView = [...boardView];

      for (let i = 0; i < goldNo;) {
        let x = Math.floor((Math.random() * 100) + 1);
        let { x: rowIndex, y: colIndex } = getIndexFromNumber(x);

        if (
          newBoardView[rowIndex] !== undefined &&
          newBoardView[rowIndex][colIndex] !== undefined &&
          newBoardView[rowIndex][colIndex] !== 'w' &&
          newBoardView[rowIndex][colIndex] !== 'b' &&
          newBoardView[rowIndex][colIndex] !== 's' &&
          newBoardView[rowIndex][colIndex] !== 'd'
        ) {
          newBoardView[rowIndex][colIndex] = 'g';
          goldArray.push(x);
          i++;
        }
      }

      setBoardView(newBoardView);
    };

    const setPits = () => {
      const newBoardView = [...boardView];

      for (let i = 0; i < pitNo;) {
        let x = Math.floor((Math.random() * 100) + 1);
        let { x: rowIndex, y: colIndex } = getIndexFromNumber(x);

        if (
          !wumpusArray.includes(x) &&
          x !== 2 &&
          x !== 11 &&
          newBoardView[rowIndex] !== undefined &&
          newBoardView[rowIndex][colIndex] !== undefined
        ) {
          newBoardView[rowIndex][colIndex] = 'p';

          // Update breeze cells
          if (rowIndex > 0) newBoardView[rowIndex - 1][colIndex] = 'b';
          if (rowIndex < boardSize - 1) newBoardView[rowIndex + 1][colIndex] = 'b';
          if (colIndex > 0) newBoardView[rowIndex][colIndex - 1] = 'b';
          if (colIndex < boardSize - 1) newBoardView[rowIndex][colIndex + 1] = 'b';

          i++;
        }
      }

      setBoardView(newBoardView);
    };

    initializeBoardView();
    setWumpus();
    setGold();
    setPits();
  }, []);

  const handleKeyDown = (event) => {
    if (score > 0) {
      switch (event.keyCode) {
        case 37: // Left
          if (myPos.y !== 0) {
            setMyPos({ ...myPos, y: myPos.y - 1 });
            setAttribute();
          }
          break;
        case 38: // Up
          if (myPos.x !== 0) {
            setMyPos({ ...myPos, x: myPos.x - 1 });
            setAttribute();
          }
          break;
        case 39: // Right
          if (myPos.y !== boardSize - 1) {
            setMyPos({ ...myPos, y: myPos.y + 1 });
            setAttribute();
          }
          break;
        case 40: // Down
          if (myPos.x !== boardSize - 1) {
            setMyPos({ ...myPos, x: myPos.x + 1 });
            setAttribute();
          }
          break;
        default:
          break;
      }
    }
  };

  const setAttribute = () => {
    if (score === 0) {
      alert("Game Over");
      window.location.reload();
    }

    setScore(score - 1);
    document.getElementById("playinfo").innerText = "Current score: " + score;
    let textt = "";
    let theDiv = document.getElementById(posToDivID(myPos.x, myPos.y));
    theDiv.classList.add("visited");
    theDiv.classList.add("Nvisited");

    if (boardView[myPos.x][myPos.y] === 's') theDiv.classList.add("snitchCell");
    else if (boardView[myPos.x][myPos.y] === 'b') theDiv.classList.add("breezeCell");
    else if (boardView[myPos.x][myPos.y] === 'd') theDiv.classList.add("doubleCell");
    else if (boardView[myPos.x][myPos.y] === 'w') theDiv.classList.add("wumpusCell");
    else if (boardView[myPos.x][myPos.y] === 'p') theDiv.classList.add("pitCell");
    else if (boardView[myPos.x][myPos.y] === 'g') {
      setFoundGold(foundGold + 1);
      theDiv.classList.add("goldCell");
      textt = "You have found gold, " + (goldNo - foundGold) + " remaining";
      document.getElementById("goldinfo").innerText = textt;
      setScore(score + 100);
      document.getElementById("playinfo").innerText = "Current score: " + score;
      if (foundGold === goldNo) {
        alert("Congratulations! You have found all the gold!");
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [myPos, handleKeyDown]);

  return (
    <div className="App">
      <p>Each move costs 1 score. Each gold adds 100 to the score. Initial score is 100. You can't move when your score is 0</p>
      <p id="goldinfo">{foundGold} gold found, {goldNo - foundGold} remaining</p>
      <p id="playinfo">Current score: {score}</p>
      <div className="board">
        {boardView.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div key={colIndex} className={`cell ${posToDivID(rowIndex, colIndex)}`} id={posToDivID(rowIndex, colIndex)}></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
