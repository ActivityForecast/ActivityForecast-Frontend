import { Link } from 'react-router-dom';
function LoginMenu() {
  return (
    <Link to="/login">
      <div className="w-[70px] py-1 flex items-center justify-center rounded-lg text-white hover:bg-blue-500 bg-[#0d99ff]">
        로그인
      </div>
    </Link>
  );
}

export default LoginMenu;
