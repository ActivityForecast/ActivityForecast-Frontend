import { ReactComponent as HomeIcon } from 'assets/icons/gnb_home.svg';
import { Link } from 'react-router-dom';
function Home() {
  return (
    <Link to="/home">
      <div className="px-1 rounded hover:bg-gray-100">
        <HomeIcon />
      </div>
    </Link>
  );
}

export default Home;
