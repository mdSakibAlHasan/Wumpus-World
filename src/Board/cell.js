import React, { Component } from 'react';
import "./board.css"

class Cell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focused: false,
    };

    this.cellRef = React.createRef();
  }

  componentDidMount() {
    // Add an event listener to the cell element for keyboard navigation
    this.cellRef.current.addEventListener('keydown', this.handleKeyPress);
    //prevent mouse click
    this.cellRef.current.addEventListener('mousedown', this.handleMouseDown);
  }

  componentWillUnmount() {
    // Remove the event listener when the component unmounts
    this.cellRef.current.removeEventListener('keydown', this.handleKeyPress);
  //prevent mouse click
    this.cellRef.current.removeEventListener('mousedown', this.handleMouseDown);
  
  }

  handleKeyPress = (e) => {
    const { num } = this.props;
    const cell = this.cellRef.current;

    // Calculate the grid dimensions (in this case, 10x10)
    const numRows = 10;
    const numCols = 10;

    // Calculate the current row and column of the cell
    const row = Math.floor((num - 1) / numCols);
    const col = (num - 1) % numCols;

    // Handle arrow key presses
    switch (e.key) {
      case 'ArrowLeft':
        // Move focus to the cell on the left
        if (col > 0) {
          const leftCellNum = num - 1;
          const leftCell = document.querySelector(`[data-num="${leftCellNum}"]`);
          if (leftCell) {
            leftCell.focus();
          }
        }
        break;
      case 'ArrowRight':
        // Move focus to the cell on the right
        if (col < numCols - 1) {
          const rightCellNum = num + 1;
          const rightCell = document.querySelector(`[data-num="${rightCellNum}"]`);
          if (rightCell) {
            rightCell.focus();
          }
        }
        break;
      case 'ArrowUp':
        // Move focus to the cell above
        if (row > 0) {
          const aboveCellNum = num - numCols;
          const aboveCell = document.querySelector(`[data-num="${aboveCellNum}"]`);
          if (aboveCell) {
            aboveCell.focus();
          }
        }
        break;
      case 'ArrowDown':
        // Move focus to the cell below
        if (row < numRows - 1) {
          const belowCellNum = num + numCols;
          const belowCell = document.querySelector(`[data-num="${belowCellNum}"]`);
          if (belowCell) {
            belowCell.focus();
          }
        }
        break;
      default:
        break;
    }
  };

  handleFocus = () => {
    this.setState({ focused: true });
  };

  handleBlur = () => {
    this.setState({ focused: false });
  };

  handleMouseDown = (e) => {
    e.preventDefault();
  };

  render() {
    const { num } = this.props;
    const { focused } = this.state;

    return (
      <td
        className={`cell ${focused ? 'focused' : ''}`}
        tabIndex="0"
        ref={this.cellRef}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        data-num={num}
      >
        
      </td>
    );
  }
}

export default Cell;
