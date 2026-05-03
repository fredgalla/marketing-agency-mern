import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Contact from "./components/Contact";
import Admin from "./components/Admin";

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      <Contact />
    </>
  );
}

function App() {
  return (
    <div>
      <nav className="page-switcher">
        <Link to="/">Home</Link>
        <Link to="/admin">Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;