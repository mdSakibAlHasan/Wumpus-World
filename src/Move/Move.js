
const SIZE=10;
const PITNumber=10;

const EMPTY= 'e';
const PIT= 'p';
const BREEZE= 'b';
//const BUMP= 3;
const WUMPUS= 'w';
const STENCH= 's';
const BREEZEstench= 'bs';
//const SCREAM= 7;
const GOLD= 'g';
const UNCOVER= 'u';
const SAFE= 'sa';
const CANpit= 'cp';
const CANwumpus= 'cw';
const CANboth= 'cb';



class WumpusWorld {
    constructor() {
      this.board = Array(SIZE).fill(null).map(() => Array(SIZE).fill(EMPTY));
      this.agentX = 0;
      this.agentY = 0;
      this.agentHasGold = false;
      this.agentHasArrow = true;
      this.gameOver = false;
    }

    validCheck(i, j) {
        return i >= 0 && i < SIZE && j >= 0 && j < SIZE;
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

    passingMove(i,j){
      return this.checkAdjacentCell(this.board, i, j);
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

    checkAdjacentCell(board, i, j) {
        if(board[i][j] === PIT) return PIT;
        else if(board[i][j] === WUMPUS) return WUMPUS;
        else if(board[i][j] === GOLD) return GOLD;

        let hasPit=false, hasWumpus=false;
        const directions = [
          [1, 0],
          [0, 1],
          [-1, 0],
          [0, -1],
        ];
        for (const [px, py] of directions) {
          const x = i + px;
          const y = j + py;
          if (this.validCheck(x, y) && board[x][y] === PIT) hasPit=true;
          else if (this.validCheck(x, y) && board[x][y] === WUMPUS) hasWumpus=true;

        }
      
        if(hasPit && hasWumpus) return BREEZEstench;
        else if(hasPit) return BREEZE;
        else if(hasWumpus) return STENCH;
        else return EMPTY;
        
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
      this.game;
    }


    directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ];
    

    initiateTheGame(){
        this.game = new WumpusWorld();
        this.game.createBoard();
        // this.originalBoard = game.passingBoard();

        // console.log("Here are the initial board");
        // for(let row of this.originalBoard){
        //     console.log(row.join("  "));
        //     console.log();
        // }

        this.findBestMove();
    }


    findBestMove(){
        this.board[this.agentX][this.agentY] = EMPTY;
        let count=0, checkArray;
        do {
            console.log("lests check ",count);
            checkArray = this.findAdjacentCell(this.board);
            console.log(checkArray, " here after get it")
            for(const point of checkArray){
                //console.log(point, " and status ",this.board[point[0]][point[1]]);
                if(this.board[point[0]][point[1]] === SAFE){
                    const status = this.game.passingMove(point[0], point[1]);     //send the point or the path to forntent
                    this.checkStatus(status)                //check  if the gane end
                    console.log(status," is the status of ",point)
                    this.board[point[0]][point[1]] = status;
                }
            }

            count++;
        } while (this.gameOver === false && checkArray.length !==0);

        for(let row of this.board){
            console.log(row.join("  "));
            console.log();
        }

        this.createSaveMove(this.board);    //when there are no empty to move @update later try to fin better path 

        for(let row of this.board){
          console.log(row.join("  "));
          console.log();
      }
    }

    checkStatus(status){
        if(status === GOLD){
            console.log("COngratulation you find the GOLD");
            this.gameOver = true;
        }
        else if(status === WUMPUS){
            console.log("Game Over. Wumpus found in this cell");
            this.gameOver = true;
        }
        else if(status === PIT){
            console.log("Game Over. You fall in PIT");
            this.gameOver = true;
        }
    }

    createSaveMove(board){

      for(let i=0;i<SIZE;i++){      //check where there are wumpus or pit
        for(let j=0;j<SIZE;j++){
          if(board[i][j] === UNCOVER){
            for (const [px, py] of this.directions) {
              const x = i + px;
              const y = j + py;
              if (this.validCheck(x, y) && (board[x][y] === BREEZE || board[x][y] === BREEZEstench)){
                if(this.board[i][j] === CANwumpus)      //@update check that here vcan both and make both
                  this.board[i][j] = CANboth
                else
                  this.board[i][j] = CANpit;
              }
              else if(this.validCheck(x, y) && (board[x][y] === STENCH || board[x][y] === BREEZEstench )){
                if(this.board[i][j] === CANpit)
                  this.board[i][j] = CANboth
                else
                  this.board[i][j] = CANwumpus;
              }
            }
          }
        }
      }

      this.applyLogic();
        
    }


    applyLogic(){                //find acctually there are pit or wumpus exixs or not
      for(let i=0;i<SIZE;i++){
        for(let j=0;j<SIZE;j++){
            if(this.board[i][j]=== CANboth || this.board[i][j]=== CANpit ){
                this.checkSorounding(this.board, i, j, CANwumpus);
            }
            if(this.board[i][j]=== CANboth || this.board[i][j]=== CANwumpus ){
              this.checkSorounding(this.board, i, j, CANpit);
            }
        }
      }
    }   //apply here that here are actual pit and wumpus

    checkSorounding(board, i, j, sensor){   //create safe if it not wumpus or pit

      for (const [px, py] of this.directions) {   //add here sure there are pit or wumpus
        const x = i + px;
        const y = j + py;
        if (this.validCheck(x, y) && (board[x][y] === EMPTY || board[x][y] === sensor)){
          if(this.board[i][j] === CANboth)
            this.board[i][j] = sensor;
          else
            this.board[i][j] = SAFE;
        }
      }
    
    }


    findAdjacentCell(board){          //return all the set of cell that has adjacent uncover cell
        const mySet = new Set();
        for(let i=0;i<SIZE;i++){
            for(let j=0;j<SIZE;j++){
                if(board[i][j]===UNCOVER && this.checkAdjacentCell(board,i,j) ){
                    mySet.add([i,j]);
                    this.board[i][j] = SAFE;
                }
            }
        }

        const pointArray = Array.from(mySet);
        return pointArray;
    }

    validCheck(i, j) {
        return i >= 0 && i < SIZE && j >= 0 && j < SIZE;
    }
   
      
    checkAdjacentCell(board, i, j) {      //return if there any cell that is uncover
        const directions = [
          [1, 0],
          [0, 1],
          [-1, 0],
          [0, -1],
        ];
        for (const [px, py] of this.directions) {
          const x = i + px;
          const y = j + py;
          if (this.validCheck(x, y) && board[x][y] === EMPTY) 
            return true;
        }
      
        return false;
    }

 
}

const play = new Agent();
play.initiateTheGame();
//play.findBestMove();

