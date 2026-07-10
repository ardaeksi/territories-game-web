import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CommandCenter } from "./pages/CommandCenter";
import { JoinScreen } from "./pages/JoinScreen";
import { GameCommandCenter } from "./pages/GameCommandCenter";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JoinScreen />} />
        <Route path="/game" element={<GameCommandCenter />} />
        <Route path="/sim" element={<CommandCenter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
