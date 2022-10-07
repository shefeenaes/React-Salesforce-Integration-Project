import React, { useState, useEffect } from 'react'
import "./Login.css";
import axios from 'axios';
import MetadataFetch from "./MetadataFetch";
const Login = () => {

    const [isLoggedIn, Setlogin] = useState(false);
    const [isMeta, SetMeta] = useState(false);
    const [isProduction, setEnv] = useState();
    const [Token, setToken] = useState();
    const [Mydomain, setMydomain] = useState();
    const [Refresh, setRefresh] = useState();
    const [userName, setUserName] = useState();
    // const [isBoolean, SetBoolean] = useState(false);
    const getToken = async (code) => {

        console.log('inside getToken');
        let TokenRequestURL = process.env.REACT_APP_TOKEN_REQUEST.replace('<CODE>', code);
        let logindata = '';
        try {
            logindata = await axios.post('http://localhost:3001/token', { 'token-url': TokenRequestURL }).catch((error) => {
                if (error.response) {
                    console.log(error.response);
                }
            });
            localStorage.setItem("token", logindata.data['token']);
            localStorage.setItem("refresh", logindata.data['refresh'])
            localStorage.setItem("instance-url", logindata.data['instance-url'])
            localStorage.setItem("username", logindata.data['username']);
            setUserName(localStorage.getItem('username'));
            const token = localStorage.getItem('token');
            console.log('<--Login:token-->' + token);
            setToken(token);
            const refresh = localStorage.getItem('refresh');
            console.log('<--Login:refresh-->' + refresh);
            setRefresh(refresh);
            const mydomain = localStorage.getItem('instance-url');
            console.log('<--Login:mydomain-->' + mydomain);
            setMydomain(mydomain);
            localStorage.setItem(true, 'boolean');
            // SetBoolean(true);
        } catch (error) {

        }



    }
    useEffect(() => {

        // console.log('boolean-1->' + isBoolean);
        //5.Show the login button.
        const queryParams = new URLSearchParams(window.location.search);
        const code = queryParams.get("code")
        if (code) {
            //encrypte the code
            console.log('code  found in url');
            // localStorage.setItem("code", code) // store in local storage
            //generate token 
            Setlogin(true);
            // const interval = setInterval(() => {
            const isBoolean = localStorage.getItem('boolean');
            if (isBoolean === null) {
                getToken(code);
            }
            console.log('isBoolean-->' + isBoolean);
            // localStorage.setItem("token", token)
            //  }, 7200000);
            //  return () => clearInterval(interval);
            const username = localStorage.getItem('username');
            if (username) {
                setUserName(username);
            }


        }
        else {
            console.log("code not found in url");
            Setlogin(false);
        }


    }, []);


    const logoutHandler = async (event) => {
        event.preventDefault();
        console.log('inside logout handler');
        const token = localStorage.getItem('token');
        console.log('<--Login:token-->' + token);
        setToken(token);
        const mydomain = localStorage.getItem('instance-url');
        console.log('<--Login:mydomain-->' + mydomain);

        await axios.post('http://localhost:3001/logout', { 'token': token, 'mydomain': mydomain }).catch((error) => {
            if (error.response) {
                console.log(error.response);
            }
        });
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("instance-url");
        localStorage.removeItem("username");
        window.location.replace('http://localhost:3000');
    }

    const metadaHandler = (event) => {
        event.preventDefault();
        SetMeta(current => !current);
    }

    const handleChange = () => {

        setEnv(current => !current);
    };



    const loginHandler = async (event) => {
        event.preventDefault();
        let url;
        if (isProduction === true) {
            //production
            url = process.env.REACT_APP_AUTHORIZATION_REQUEST;
            // localStorage.setItem("instance", "login");
        }
        else {
            //sandbox
            url = process.env.REACT_APP_AUTHORIZATION_REQUEST.replace('login', 'test');
            //  localStorage.setItem("instance", "test");
        }
        console.log('url-->' + url);

        window.location.replace(url);


    }
    if (isLoggedIn === false) {

        return (

            <div className="container">

                <form onSubmit={loginHandler}>
                    <div><label className="env">Select your environment</label></div>
                    <div>
                        <label className="toggle">
                            <input type="checkbox" id="env"
                                onChange={handleChange} />
                            <span className="slider"></span>
                            <span className="labels" data-on="Production" data-off="SandBox"></span>
                        </label>
                    </div>
                    <div>

                        <button type="submit" className="button">Login</button>


                    </div>
                </form>

            </div>


        );
    }
    else {
        return (
            <div className="container">
                <form >

                    <div>
                        <button type="submit" onClick={logoutHandler} className="button2">Logout</button>
                        <button type="submit" onClick={metadaHandler} className="button2">Get Metadata</button>
                    </div>
                </form>
                <div><h1 className='textStyle'> Logged In As: {userName}</h1> </div>
                <div>
                    {isMeta === true &&
                        <div><MetadataFetch token={Token} refresh={Refresh} mydomain={Mydomain} /></div>
                    }
                </div>
            </div>
        );


    }







}

export default Login;