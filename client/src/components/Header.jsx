import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav>
        <h1>My Agency</h1>

        <ul>
          <li><Link to="/">Home</Link></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;