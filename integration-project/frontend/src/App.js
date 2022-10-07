import Navbar from "./Navbar";
import About from "./About";
import Login from "./Login";

import React from 'react'
import "./App.css";



function App() {

  return (<div className="App"><Navbar />

    <div><About /></div>
    <div><Login /></div>
  </div>);
}
export default App; 
