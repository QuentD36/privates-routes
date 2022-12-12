import {Link} from 'react-router-dom';
import '../index.css';

const Navbar = () => {
  return (
    <nav>
      <ul className="ul-custom">
        <li className="li-custom">
          <Link to={`/`}>Login</Link>
        </li>
        <li className="li-custom">
          <Link to={`/dashboard`}>Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;