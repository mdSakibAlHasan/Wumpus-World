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
            x = getRandomInt(2, SIZE - 1);
            y = getRandomInt(2, SIZE - 1);
        } while (this.board[x][y] !== EMPTY);
        this.board[x][y] = PIT;
        }

        let x, y;
        do {                                           //place wuppus
            x = getRandomInt(4, SIZE - 1);
            y = getRandomInt(4, SIZE - 1);
        } while (this.board[x][y] !== EMPTY);
        this.board[x][y] = WUMPUS;
          
        
        do {                                    //place gold
            x = getRandomInt(5, SIZE - 1);
            y = getRandomInt(5, SIZE - 1);
        } while (this.board[x][y] !== EMPTY);
        this.board[x][y] = GOLD;
          
        
        console.log(this.board.join(" "))
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
  
  // Create a new instance of the WumpusWorld game
  const game = new WumpusWorld();
  game.createBoard();this
  
  // Example moves for the agent
//   game.move(1, 0); // Move right
//   game.move(0, 1); // Move down
//   game.move(-1, 0); // Move left
//   game.move(0, -1); // Move up
  
  // At this point, you can continue making moves, and the game will update accordingly.
  // You'll need to implement logic for updating the board based on the agent's perception and safe moves.
  
  // To find the gold, you need to implement a strategy such as a search algorithm (e.g., A* or BFS)
  // to explore the Wumpus World and make safe moves to reach the gold.
  