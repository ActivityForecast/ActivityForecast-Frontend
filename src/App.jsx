import Gnb from 'components/Gnb/Gnb';
import HomePage from 'pages/Home/HomePage';
import LoginPage from 'pages/Login/LoginPage';
import SignupPage from 'pages/Signup/SignupPage';
import CrewPage from 'pages/Crew/CrewPage';
import { Route, Routes } from 'react-router-dom';
import HistoryPage from 'pages/History/HistoryPage';

function App() {
  return (
    <div>
      <Gnb />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/crew" element={<CrewPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
