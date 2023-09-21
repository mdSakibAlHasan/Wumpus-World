
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


class Graph {
  constructor() {
    this.V=0;
    this.adj;
  }

  isKnown(board, i , j){
    if(board[i][j] === EMPTY || board[i][j] === BREEZE || board[i][j] === STENCH ||board[i][j] === BREEZEstench || board[i][j] === SAFE ){
      return true;
    }
    else{
      return false;
    }
  }

  createGraph(board){
    for(let i=0;i<SIZE;i++){
      for(let j=0;j<SIZE;j++){
        if(this.isKnown(board, i, j)){
          this.V++;
        }
      }
    }

    this.adj = new Array(this.V).fill(null).map(() => []);

    for(let i=0;i<SIZE;i++){
      for(let j=0;j<SIZE;j++){
        if(this.isKnown(board, i, j)){
          console.log(i,j);
          if(this.isKnown(board, i, j+1)){
            this.addEdge((i*10+j),(i*10+j+1));
            console.log("left")
          }
          else if(this.isKnown(board, i+1, j)){
            this.addEdge((i*10+j),((i+1)*10+j));
            console.log("down")
          }
        }
      }
    }
  }

  addEdge(u, v) {
    this.adj[u].push(v);
    this.adj[v].push(u);
  }

  BFS(s, d) {
    console.log("The graph is ",this.adj);
    const visited = new Array(this.V).fill(false);
    const queue = [];

    queue.push(s);
    visited[s] = true;

    const parent = new Array(this.V).fill(-1);

    while (queue.length > 0) {
      const u = queue.shift();

      for (const v of this.adj[u]) {
        if (!visited[v]) {
          queue.push(v);
          visited[v] = true;
          parent[v] = u;
        }
      }
    }

    if (!visited[d]) {
      return false;
    }

    const path = [];

    while (d !== -1) {
      path.push(d);
      d = parent[d];
    }

    path.reverse();

    return path;
  }

  findMinCostPath(s, d) {
    const path = this.BFS(s, d);

    if (!path) {
      return -1;
    }

    return path.length - 1;
  }
}

// Example usage:

// const g = new Graph(6);

// g.addEdge(0, 1);
// g.addEdge(0, 2);
// g.addEdge(1, 3);
// g.addEdge(2, 3);
// g.addEdge(3, 4);
// g.addEdge(4, 5);

// const path = g.BFS(4, 2);
// console.log(path," is the path");
// const s = 0;
// const d = 5;

// const cost = g.findMinCostPath(s, d);

// if (cost === -1) {
//   console.log("No path exists");
// } else {
//   console.log("The minimum cost path is", cost);
// }








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
            const graph = new Graph();
            graph.createGraph(this.board);
            let cost=Number.MAX_VALUE, lowestPath, lowestPoint;
            for(const point of checkArray){
                //find here are the shortest path algorithm
                const path = graph.BFS(this.agentX*10+this.agentY,point[0]*10+point[1]);
                console.log(path," is the path for explore");
                if(path.length<cost){
                  cost = path.length;
                  lowestPath = path;
                  lowestPoint = point;
                }

                //add function to explore path

                this.board[point[0]][point[1]] = UNCOVER;
                //console.log(point, " and status ",this.board[point[0]][point[1]]);
                // if(this.board[point[0]][point[1]] === SAFE){
                //     const status = this.game.passingMove(point[0], point[1]);     //send the point or the path to forntent
                //     this.checkStatus(status)                //check  if the gane end
                //     console.log(status," is the status of ",point)
                //     this.board[point[0]][point[1]] = status;
                // }
            }
            console.log("This is the lowest path",lowestPath);
            const status = this.game.passingMove(lowestPoint[0], lowestPoint[1]);     //send the point or the path to forntent
            this.checkStatus(status)                //check  if the gane end
            console.log(status," is the status of ",lowestPoint)
            this.board[lowestPoint[0]][lowestPoint[1]] = status;
            count++;
        } while (this.gameOver === false && checkArray.length !==0);

        for(let row of this.board){
            console.log(row.join("    "));
            console.log();
        }

        //this part when there are no move
        
      //   this.createSaveMove(this.board);    //when there are no empty to move @update later try to fin better path 

      //   for(let row of this.board){
      //     console.log(row.join("    "));
      //     console.log();
      // }
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
                this.checkSorounding(this.board, i, j, STENCH);
            }
            if(this.board[i][j]=== CANboth || this.board[i][j]=== CANwumpus ){
              this.checkSorounding(this.board, i, j, BREEZE);
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
        // else if(this.validCheck(x, y) && board[x][y] !== UNCOVER){

        // }
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
          //if (this.validCheck(x, y) && (board[x][y] === EMPTY || board[x][y] === SAFE)) 
          if (this.validCheck(x, y) && board[x][y] === EMPTY ) 
            return true;
        }
      
        return false;
    }

 
}

const play = new Agent();
play.initiateTheGame();
play.findBestMove();

