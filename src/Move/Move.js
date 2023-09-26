
const SIZE=10;
const PITNumber=8;
const WUMPUSNumber=2;
const GOLDNumber = 2;

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

        for (let i = 0; i < WUMPUSNumber; i++) {
          let x, y;
          do {                                           //place wuppus
              x = getRandomInt(2, SIZE - 1);
              y = getRandomInt(2, SIZE - 1);
          } while (this.board[x][y] !== EMPTY);
          this.board[x][y] = WUMPUS;
        }
          
        let x,y;
        do {                                    //place gold
            x = getRandomInt(3, SIZE - 1);
            y = getRandomInt(3, SIZE - 1);
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

    killWumpus(i,j){
      if(this.board[i][j] === WUMPUS){
        this.board[i][j] = EMPTY;
        return true;
      }else{
        return false;
      }
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
  

    checkAdjacentCell(board, i, j) {
        if(board[i][j] === PIT) return PIT;
        else if(board[i][j] === WUMPUS) return WUMPUS;
        else if(board[i][j] === GOLD){
          this.board[i][j] = EMPTY;
          return GOLD;
        }

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
    this.adj;
  }

  isKnown(board, i , j){
    if(i<10 && j<10 &&(board[i][j] === EMPTY || board[i][j] === BREEZE || board[i][j] === STENCH ||board[i][j] === BREEZEstench || board[i][j] === SAFE )){
      return true;
    }
    else{
      return false;
    }
  }

  createGraph(board){

    this.adj = new Array(100).fill(null).map(() => []);
    //console.log(this.adj," is initial graph")

    for(let i=0;i<SIZE;i++){
      for(let j=0;j<SIZE;j++){
        if(this.isKnown(board, i, j)){
          //console.log(i,j);
          if(this.isKnown(board, i, j+1)){
            this.addEdge((i*10+j),(i*10+j+1));
            //console.log("left")
          }
          if(this.isKnown(board, i+1, j)){
            this.addEdge((i*10+j),((i+1)*10+j));
            //console.log("down")
          }
        }
      }
    }

    //console.log(this.adj," is after create graph")

  }

  addEdge(u, v) {
    //console.log(u,"--" ,v)
    this.adj[u].push(v);
    this.adj[v].push(u);
  }

  BFS(s, d) {
    //console.log("The graph is ",this.adj);
    const visited = new Array(100).fill(false);
    const queue = [];

    queue.push(s);
    visited[s] = true;

    const parent = new Array(100).fill(-1);

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
      this.goldNumber = GOLDNumber;
      this.totalPoint = 0;
      this.numberOfWumpusKill=0;
      this.PITProbability=1;
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
      this.board[this.agentX][this.agentY] = EMPTY;
      while(this.gameOver === false){
        console.log("Here are agin find cell for empty cell")
        this.findBestMove();

        if(this.gameOver===false){
          console.log("Probability part started")
          this.createSaveMove();
        }
      }

      console.log("Final statement: ");
      console.log(this.totalPoint," is the point");
      console.log((GOLDNumber-this.goldNumber),"  gold found ")
      console.log(this.numberOfWumpusKill," total wumpus kill")
        

    }


    findBestMove(){
        let count=0, checkArray;
        do {
            //console.log("lests check ",count);
            checkArray = this.findAdjacentCell(this.board);
            console.log(checkArray, " here after get it");
            if(checkArray.length === 0){
              break;
            }
            const graph = new Graph();
            graph.createGraph(this.board);
            let cost=Number.MAX_VALUE, lowestPath, lowestPoint;
            for(const point of checkArray){
                const path = graph.BFS(this.agentX*10+this.agentY,point[0]*10+point[1]);
                if(path.length<cost){
                  cost = path.length;
                  lowestPath = path;
                  lowestPoint = point;
                }

                this.board[point[0]][point[1]] = UNCOVER;
            }
            //console.log("This is the lowest path",lowestPath);
            let status = this.game.passingMove(lowestPoint[0], lowestPoint[1]);     //send the point or the path to forntent
            this.checkStatus(status)                //check  if the gane end
            if(status===GOLD)
              status=this.game.passingMove(lowestPoint[0], lowestPoint[1]);
            this.board[lowestPoint[0]][lowestPoint[1]] = status;
            this.agentX=lowestPoint[0];
            this.agentY=lowestPoint[1];
            this.totalPoint -= (lowestPath.length-1);
            count++;
        } while (this.gameOver === false && checkArray.length !==0);

        for(let row of this.board){
            console.log(row.join("    "));
            console.log();
        }
    }

    checkStatus(status){
        if(status === GOLD){
          this.totalPoint += 1000;
            console.log("COngratulation you find the GOLD");
            if(--this.goldNumber==0)
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

    convertedArray(sensor){
      const probability = Array(SIZE).fill(null).map(() => Array(SIZE).fill(0));
      for(let i=0;i<SIZE;i++){      //check where there are wumpus or pit
        for(let j=0;j<SIZE;j++){
          if(this.board[i][j] === EMPTY || this.board[i][j] === BREEZEstench || this.board[i][j] === sensor){
            probability[i][j] = -1;
          }
          else if(this.board[i][j] === UNCOVER){
            for (const [px, py] of this.directions) {
              const x = i + px;
              const y = j + py;
              if (this.validCheck(x, y) && (this.board[x][y] === sensor || this.board[x][y] === BREEZEstench)){
                probability[i][j]++;                 
              }
            }
          }
        }
      }

      return probability;
    }

    createSaveMove(){

      const pitProbability = this.convertedArray(BREEZE);
      const wumpusProbability = this.convertedArray(STENCH);    
      this.applyLogic(pitProbability, wumpusProbability)              //try to logic apply here
    }

    makeMovement(i,j){
      console.log("make a probability movement");
      this.board[i][j] = SAFE;
      //replace it with another function
      const graph = new Graph();
      graph.createGraph(this.board);
      const path = graph.BFS(this.agentX*10+this.agentY,i*10+j);
      let status = this.game.passingMove(i, j);     //send the point or the path to forntent
      if(status===GOLD)
        status=this.game.passingMove(i, j);
      this.checkStatus(status)                //check  if the gane end
      console.log(status," is the status of ",i," - ",j)
      this.board[i][j] = status;
      this.agentX=i;
      this.agentY=j;
      this.totalPoint -= (path.length-1);
    }


    applyLogic(probability, wumpusProbability){                //find acctually there are pit or wumpus exixs or not
      for(let i=0;i<SIZE;i++){
        for(let j=0;j<SIZE;j++){
            if(this.board[i][j]=== CANboth || this.board[i][j]=== CANpit ){
              if(this.checkSorounding(this.board, i, j, STENCH)) return true
            }
            if(this.board[i][j]=== CANboth || this.board[i][j]=== CANwumpus ){
              if(this.checkSorounding(this.board, i, j, BREEZE)) return true;
            }
        }
      }

      if(this.tryKillWumpus(wumpusProbability))
        return ;
      console.log("No inferance apply here--------------------")
      for(let row of probability){
        console.log(row.join("    "));
        console.log();
      }

      //where there are low probability to get the pit it can explore this
      for(let i=0;i<SIZE;i++){
        for(let j=0;j<SIZE;j++){
           if(probability[i][j] === this.PITProbability && wumpusProbability[i][j] === 0){   //@update add here list and sort then find also 2 not only 1
              this.makeMovement(i,j);
              this.PITProbability=1;
              return;
           }
        }
      }

      this.PITProbability++;      //there are no probability for PIT with 1 breeze
      return;

    }   //apply here that here are actual pit and wumpus


    tryKillWumpus(wumpusProbability){
      const mySet = new Set();
        for(let i=0;i<SIZE;i++){
            for(let j=0;j<SIZE;j++){
                if(wumpusProbability[i][j] !==-1 && wumpusProbability[i][j] !==0 ){
                  mySet.add([i,j]);
                }
            }
        }

        const myArray = Array.from(mySet);
        if(myArray.length === 0)
          return false;
        myArray.sort((a, b) => {
          const [x1, y1] = a;
          const [x2, y2] = b;
          const value1 = wumpusProbability[x1][y1];
          const value2 = wumpusProbability[x2][y2];
          return value2 - value1;
        });
        
        const [highestX, highestY] = myArray[0];
        const highestValue = wumpusProbability[highestX][highestY];
        
        console.log(`Highest Value: ${highestValue}`);
        console.log(`Coordinates: (${highestX}, ${highestY})`);

        //kill here
        if(highestValue>=2){                                  //@update check here that arrow are here 
          console.log("make a movement for kill wumpus");
          let i,j;
          for (const [px, py] of this.directions) {
            const x = highestX + px;
            const y = highestY + py;
            if (this.validCheck(x, y) && (this.board[x][y] === EMPTY || this.board[x][y] === BREEZEstench || this.board[x][y] === BREEZE || this.board[x][y] === STENCH)){
              i = x;
              j = y;   
              break;             
            }
          }
          const graph = new Graph();
          graph.createGraph(this.board);
          const path = graph.BFS(this.agentX*10+this.agentY,i*10+j);
          this.agentX=i;
          this.agentY=j;
               //send the point or the path to forntent
          //this.checkStatus(status)                //check  if the gane end
          this.totalPoint -= (path.length-1+10);
          if(this.game.killWumpus(highestX,highestY)){
            const path = graph.BFS(this.agentX*10+this.agentY,highestX*10+highestY);
            const status = this.game.passingMove(i, j);
            console.log(status," is the status of ",i," - ",j)
            this.board[i][j] = status;
            this.agentX=highestX;
            this.agentY=highestY;
            console.log("Here wumpus are killed###########################");
            this.numberOfWumpusKill++;
            //console.log(highestX," ",highestY);
            //console.log(this.board)
            for (const [px, py] of this.directions) {     //update currrent board
              const x = highestX + px;
              const y = highestY + py;
              //console.log(x," ",y," ",px," ",py)
              //console.log(this.board);
              //console.log(this.board[x])
              if (this.validCheck(x, y) && this.board[x][y] !== UNCOVER ){
                this.board[x][y] = this.game.passingMove(x,y);        
              }
            }
            this.totalPoint -= 1;
            return true;
          }

          return false;
          
        }
        else
          return false;

    }

    checkSorounding(board, i, j, sensor){             //create safe if it not wumpus or pit
      for (const [px, py] of this.directions) {       //add here sure there are pit or wumpus
        const x = i + px;
        const y = j + py;
        if (this.validCheck(x, y) && (board[x][y] === EMPTY || board[x][y] === sensor)){
          if(this.board[i][j] === CANboth)
            this.board[i][j] = sensor;
          else{
            this.makeMovement(i,j);
            return true;
          }
        }
        
      }
      return false;
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
//play.findBestMove();

