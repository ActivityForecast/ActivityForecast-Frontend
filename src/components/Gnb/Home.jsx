import { ReactComponent as HomeIcon } from 'assets/icons/gnb_home.svg';
import { Link } from 'react-router-dom';
function Home() {
  return (
    <Link to="/">
      <div className="px-2 rounded hover:bg-gray-100">
        <HomeIcon />
      </div>
    </Link>
  );
}

export default Home;
