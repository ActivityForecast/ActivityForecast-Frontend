import { ReactComponent as HomeIcon } from 'assets/icons/gnb_home.svg';
import { Link } from 'react-router-dom';
function Home() {
  return (
    <Link to="/">
      <div>
        <HomeIcon />
      </div>
    </Link>
  );
}

export default Home;
