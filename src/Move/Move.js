
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



class WumpusWorld {
    constructor() {
      this.board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(EMPTY));
      this.agentX = 0;
      this.agentY = 0;
      this.agentHasGold = false;
      this.agentHasArrow = true;
      this.gameOver = false;
    }

    createBoard(){
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
          // Place pits randomly
        for (let i = 0; i < PITNumber; i++) {
        let x, y;
        do {
            x = getRandomInt(1, SIZE - 1);
            y = getRandomInt(1, SIZE - 1);
        } while (this.board[x][y] !== EMPTY);
        this.board[x][y] = PIT;
        }

        let x, y;
        do {                                           //place wuppus
            x = getRandomInt(2, SIZE - 1);
            y = getRandomInt(2, SIZE - 1);
        } while (this.board[x][y] !== EMPTY);
        this.board[x][y] = WUMPUS;
          
        
        do {                                    //place gold
            x = getRandomInt(5, SIZE - 1);
            y = getRandomInt(5, SIZE - 1);
        } while (this.board[x][y] !== EMPTY);
        this.board[x][y] = GOLD;
          
        for(let row of this.board){
          console.log(row.join("  "));
          console.log("");
        }

    }

    passingBoard(){
      return this.board;
    }
  
    move(dx, dy) {
      if (this.gameOver) {
        console.log('Game over.');
        return;
      }
  
      const newX = this.agentX + dx;
      const newY = this.agentY + dy;
  
      if (newX < 0 || newX >= 10 || newY < 0 || newY >= 10) {
        console.log('Agent bumped into a wall.');
        return;
      }
  
      this.agentX = newX;
      this.agentY = newY;
  
      if (this.board[newX][newY] === 'gold') {
        this.agentHasGold = true;
        console.log('Agent found the gold! Game over.');
        this.gameOver = true;
      }
  
      if (this.board[newX][newY] === 'pit' || this.board[newX][newY] === 'wumpus') {
        console.log('Agent fell into a pit or encountered a wumpus. Game over.');
        this.gameOver = true;
      }
  
      // Update the board with agent's knowledge
      this.updateKnowledge();
    }
  
    updateKnowledge() {
      // Implement your logic to update the board based on agent's perception
      // This includes detecting breeze, stench, and adjacent safe cells
      // You need to keep track of the game state based on agent's actions and perception.
    }
}



class Agent {
    constructor() {
      this.board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(UNCOVER));
      this.agentX = 0;
      this.agentY = 0;
      this.agentHasGold = false;
      this.agentHasArrow = true;
      this.gameOver = false;
      this.originalBoard;
    }


    directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ];
    

    initiateTheGame(){
        const game = new WumpusWorld();
        game.createBoard();
        this.originalBoard = game.passingBoard();

        console.log("Here are the initial board");
        for(let row of this.originalBoard){
            console.log(row.join("  "));
            console.log();
        }
    }


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
play.initiateTheGame();
play.findBestMove();

