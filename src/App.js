import './Board/design.css';
import { Routes, Route} from "react-router-dom";
import Board from './Board/Home.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<Board/>} />
      </Routes>
    </div>
  );
}

export default App;
