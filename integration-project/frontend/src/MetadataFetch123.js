import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "./MetadataFetch.css";
import axios from 'axios';

const MetadataFetch = (props) => {


    const [tabIndex, setTabIndex] = useState(0);
    const [Meta, setMetaArray] = useState();
    const [checkedStatus, setStatus] = useState([]);


    //handleChange
    const handleChange = async (position) => {
        console.log('test --->' + position);
        console.log('before-->' + checkedStatus[position]['Status']);
        checkedStatus[position]['Status'] = !checkedStatus[position]['Status']
        setStatus(checkedStatus);
        console.log('after-->' + checkedStatus[position]['Status']);
        console.log('Id-->' + checkedStatus[position]['Id']);
        let newArray = [checkedStatus[position]['Id'], checkedStatus[position]['Status']];
        await axios.post('http://localhost:3001/update', { 'checkedStatus': newArray, 'mydomain': props.mydomain, 'token': props.token }).catch((error) => {
            if (error.response) {
                console.log(error.response.status);
            }
        })
        //   getMeta();
    }

    const getMeta = async () => {
        try {
            let metadata = await axios.post('http://localhost:3001/meta', { 'token': props.token, 'meta': 'validation', 'mydomain': props.mydomain }).catch((error) => {
                if (error.response) {
                    console.log(error.response.status);
                }
            });
            console.log(metadata);
            let metas = [];
            let response = metadata.data;
            let checkedStatus2 = [];
            for (let i = 0; i < response.length; i++) {
                checkedStatus2.push({ 'Id': response[i]['Id'], 'Status': response[i]['Status'] })
            }
            setStatus(checkedStatus2)
                ;
            for (let i = 0; i < response.length; i++) {
                metas.push(<div key={response[i]['Id']}>
                    <hr style={{
                        color: '#000000',
                        backgroundColor: '#000000',
                        height: 3,
                        borderColor: '#000000'
                    }} />
                    <div>
                        <div className="display"> {response[i]['Name']}</div>
                        <label className="toggle2">

                            <input type="checkbox" id={'check' + i}
                                onChange={() => handleChange(i)}
                                checked={response[i]['Status']} />
                            <span className="slider"></span>
                            <span className="labels" data-on="Active" data-off="Not Active" ></span>
                        </label>
                    </div>
                </div>)
            }
            console.log(checkedStatus);
            setMetaArray(metas);
        } catch (error) {
            console.log(error)
        }
    }
    //call meta

    getMeta();
    return (
        <div className="tabs">
            <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
                <TabList>
                    <Tab>Validation Rules</Tab>
                </TabList>
                <TabPanel>
                    <h2>Validation Rules</h2>
                    <div>   {Meta}     </div>
                </TabPanel>
            </Tabs>

        </div>
    );

}

export default MetadataFetch;