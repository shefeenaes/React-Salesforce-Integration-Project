import React from 'react'
import logo from './switch-4-512.png';
import "./Navbar.css";
const Navbar = () => {
    return (

        <nav id="Nav_Bar">
            <div id="Logo_Wrapper">
                <div>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
            </div>
            <div>
                <h1>SFConfigSwitcher</h1>
            </div>
        </nav>

    );
}

export default Navbar;