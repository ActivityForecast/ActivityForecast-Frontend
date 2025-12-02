import Gnb from 'components/Gnb/Gnb';
import HomePage from 'pages/Home/HomePage';
import LoginPage from 'pages/Login/LoginPage';
import MyPage from 'pages/MyPage/MyPage';
import SignupPage from 'pages/Signup/SignupPage';
import CrewPage from 'pages/Crew/CrewPage';
import { Route, Routes, useLocation } from 'react-router-dom';
import HistoryPage from 'pages/History/HistoryPage';
import OAuthRedirect from 'pages/OAuthRedirect';
import DetailPage from 'pages/Detail/DetailPage';
import LandingPage from 'pages/Landing/LandingPage';
import AdminPage from 'pages/Admin/AdminPage';

function App() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  return (
    <div>
      {!isLanding && <Gnb />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/detail" element={<DetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/crew" element={<CrewPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/auth/oauth2/redirect" element={<OAuthRedirect />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  );
}

export default App;
