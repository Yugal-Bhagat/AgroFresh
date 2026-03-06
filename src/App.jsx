import React from 'react';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import './App.css';
import Home from './pages/Home';
import About from './pages/About';

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <main style={{ padding: '2rem', textAlign: 'center' ,minHeight:"31vh"}}>
        <h1>Welcome to AgroFresh</h1>
        <p>Your partner in sustainable farming</p>
      </main> */}
      <Home />
      <About />
      <Footer />
    </div>
  );
}

export default App;