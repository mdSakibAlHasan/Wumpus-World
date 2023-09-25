import React from "react";
import Cell from "./cell";
//hasib

class Grid extends React.Component {
  componentDidMount() {
    // Focus on the first cell when the component mounts
    const firstCell = document.querySelector('[data-num="1"]');
    if (firstCell) {
      firstCell.focus();
    }
  }
  render() {
    const numRows = 10;
    const numCols = 10;
    let cellNum = 1;
    const cells = [];

    // Create the 10x10 grid
    for (let row = 0; row < numRows; row++) {
      const rowCells = [];
      for (let col = 0; col < numCols; col++) {
        rowCells.push(<Cell key={cellNum} num={cellNum} />);
        cellNum++;
      }
      cells.push(<tr key={row}>{rowCells}</tr>);
    }

    return (
      <div className="container mt-5">
        <table className="box">
          <tbody>{cells}</tbody>
        </table>
      </div>
    );
  }
}

export default Grid;
