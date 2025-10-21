import Gnb from 'components/Gnb/Gnb';
import LoginPage from 'pages/Login/LoginPage';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
      <Gnb />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
