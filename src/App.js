import './App.css';
import Environment from './Environment/Environment';

// import Homepage from './Pages/homePage';
import ViewBoard from './Board/board.js'
import { Routes, Route} from "react-router-dom";
// import Board from './Board/board';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <Route path="/" element={<Homepage />} /> */}
        <Route path="/" element={<Environment />} />
      </Routes>
    </div>
  );
}

export default App;
