// import './Board/design.css';
import { Routes, Route} from "react-router-dom";
import Board from './Board/board';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Board/>} />
      </Routes>
    </div>
  );
}

export default App;
