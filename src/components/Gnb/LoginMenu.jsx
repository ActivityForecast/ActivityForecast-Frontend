import Button from 'components/Button';
import { useNavigate } from 'react-router-dom';


function LoginMenu() {

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  };
  return (
    <>
    <Button
      onClick={handleLoginClick}
      size='h-8 text-sm w-[70px]'
    >
      로그인
    </Button>
    </>)
}

export default LoginMenu;
