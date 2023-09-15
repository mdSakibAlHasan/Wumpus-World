const SIZE=10;
const PITNumber=10;

const EMPTY= 0;
const PIT= 1;
const BREEZE= 2;
const BUMP= 3;
const WUMPUS= 5;
const STENCH= 6;
const SCREAM= 7;
const GOLD= 10;
const UNCOVER= 100;
const CANpit= 51;
const CANwumpus= 52;

class Agent {
    constructor() {
      this.board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(UNCOVER));
      this.agentX = 0;
      this.agentY = 0;
      this.agentHasGold = false;
      this.agentHasArrow = true;
      this.gameOver = false;
    }

    directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ];

    findBestMove(){
        this.board[this.agentX][this.agentY] = EMPTY;
        let count=0;
        do {
            console.log("lests check ",count);
            let checkArray = this.createSaveMove(this.board);
            for(const point of checkArray){
                console.log(point, " and status ",this.board[point[0]][point[1]]);
                if(this.board[point[0]][point[1]] === UNCOVER){
                    this.board[point[0]][point[1]] = EMPTY;     //send the point or the path to forntent
                }
            }

            count++;
        } while (this.gameOver === false && count<5);

        for(let row of this.board){
            console.log(row.join("  "));
            console.log();
        }

    }

    createSaveMove(board){
        const checkArray = this.findAdjacentCell(board);
        for(const point of checkArray){
            for (const [px, py] of this.directions) {
                const x = point[0] + px;
                const y = point[1] + py;
                if (this.validCheck(x, y) && board[x][y] === BREEZE){
                    this.board[x][y] = CANpit;
                }
                else if(this.validCheck(x, y) && board[x][y] === STENCH){
                    this.board[x][y] = CANwumpus;
                }
                
            }
            
        }

        return checkArray;
    }

    findAdjacentCell(board){
        const mySet = new Set();
        for(let i=0;i<SIZE;i++){
            for(let j=0;j<SIZE;j++){
                if(board[i][j]===UNCOVER && this.checkAdjacentCell(board,i,j) ){
                    mySet.add([i,j]);
                }
            }
        }

        const pointArray = Array.from(mySet);
        return pointArray;
    }

    validCheck(i, j) {
        return i >= 0 && i < SIZE && j >= 0 && j < SIZE;
    }
   
      
    checkAdjacentCell(board, i, j) {
        const directions = [
          [1, 0],
          [0, 1],
          [-1, 0],
          [0, -1],
        ];
        for (const [px, py] of this.directions) {
          const x = i + px;
          const y = j + py;
          if (this.validCheck(x, y) && board[x][y] !== UNCOVER) return true;
        }
      
        return false;
    }

 
}

const play = new Agent();
play.findBestMove();

