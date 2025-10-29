import Gnb from 'components/Gnb/Gnb';
import HomePage from 'pages/Home/HomePage';
import LoginPage from 'pages/Login/LoginPage';
import SignupPage from 'pages/Signup/SignupPage';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Gnb />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
      </Routes>
    </div>
  );
}

export default App;
