import React from 'react'
import "./About.css";

const About = () => {
    return (

        <div>
            <div className="aboutUs">
                <h2>About Us</h2>
                <br />
                <div >
                    This tool provides an interface to easily enable and disable components in your Salesforce Org - Workflows, Triggers and Validation Rules. Very useful when doing data migrations and needing to disable certain automation.
                    None of your organisation information or data is captured or kept from running this tool.
                </div>
            </div>
            <div className='note'>
                <b>Note:</b> This application uses multiple API calls to your Salesforce Org to retrieve metadata and execute the logic it needs to run. Each Salesforce Org has a 24 hour limit of API calls it can make, and may break other integrations if you exceed this limit.
            </div>
        </div>


    );
}

export default About;