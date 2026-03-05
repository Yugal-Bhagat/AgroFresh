import React from 'react';
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import './App.css';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Navbar />
      {/* <main style={{ padding: '2rem', textAlign: 'center' ,minHeight:"31vh"}}>
        <h1>Welcome to AgroFresh</h1>
        <p>Your partner in sustainable farming</p>
      </main> */}
      <Home />
      <Footer />
    </div>
  );
}

export default App;