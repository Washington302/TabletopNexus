import { BrowserRouter, Routes, Route } from "react-router-dom";
import CharacterPage from "./pages/CharacterPage";
import Dashboard from "./pages/Dashboard";
import AccountDashboard from "./pages/AccountDashboard";
import AuthPage from "./pages/AuthPage";
import ChooseGamePage from "./pages/ChooseGamePage";
import CreateCharacterPage from "./pages/CreateCharacterPage";
import GamesPage from "./pages/GamesPage";
import Splash from "./pages/Splash";
import Navbar from "./components/Navbar";
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
  <Route path="/" element={<Splash />} />
  <Route path="/dashboard" element={<AccountDashboard />} />
  <Route path="/character/:gameId" element={<CharacterPage />} />
  <Route path="/games" element={<GamesPage />} />
  <Route path="/auth" element={<AuthPage />} />
  <Route path="/choose-game" element={<ChooseGamePage />} />
  <Route path="/create-character/:gameId" element={<CreateCharacterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
