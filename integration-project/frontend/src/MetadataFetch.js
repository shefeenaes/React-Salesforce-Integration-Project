import { useEffect, useState } from 'react';
import "./MetadataFetch.css";
import axios from 'axios';
const MetadataFetch = (props) => {
    const [data, setData] = useState({ data: [] });

    const [checkedStatus, setStatus] = useState([]);
    const [err, setErr] = useState('');

    const handleChange = async (position) => {
        console.log('test --->' + position + '--->Id-->' + checkedStatus[position]['Id']);
        console.log('before-->' + checkedStatus[position]['Status']);
        const tmpArr = checkedStatus;
        tmpArr[position]['Status'] = !tmpArr[position]['Status']
        console.log('after-->' + checkedStatus[position]['Status']);
        setStatus(tmpArr)
        console.log(checkedStatus);
        // checkedStatus[position]['Status'] = !checkedStatus[position]['Status']
        //   setStatus(checkedStatus);
        //  let newArray = [checkedStatus[position]['Id'], checkedStatus[position]['Status']];
        // getData();
    }
    const deployHandler = async (event) => {
        event.preventDefault();
        console.log(checkedStatus);
        await axios.post('http://localhost:3001/update', { 'checkedStatus': checkedStatus, 'mydomain': props.mydomain, 'token': props.token, 'refresh': props.refresh }).catch((error) => {
            if (error.response) {
                console.log(error.response.status);
            }
        })
    }

    useEffect(() => {
        // 👇️ this only runs once
        console.log('useEffect ran');
        // 👇️ fetch data from remote API

        const getData = async () => {
            try {
                console.log('props.token-->' + props.token);
                console.log('props.mydomain -->' + props.mydomain);
                let metadata = await axios.post('http://localhost:3001/meta', { 'token': props.token, 'meta': 'validation', 'mydomain': props.mydomain }).catch((error) => {
                    if (error.response) {
                        console.log(error.response.status);
                    }
                });
                console.log(metadata);

                let response = metadata.data;
                let checkedStatus2 = [];
                for (let i = 0; i < response.length; i++) {
                    checkedStatus2.push({ 'Id': response[i]['Id'], 'Status': response[i]['Status'] })
                }
                setStatus(checkedStatus2)
                setData(metadata);
            } catch (err) {
                setErr(err.message);
            }
        }

        getData();
    }, [props]); // 👈️ empty dependencies array



    return (
        <>  {err && <h2>{err}</h2>}
            <table>
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                    </tr>
                    {data.data.map((meta, i) => (
                        <tr key={i}>
                            <td>{meta.Name}</td>
                            <td><div className="display">
                                <label className="toggle2">

                                    <input type="checkbox"
                                        onChange={() => handleChange(i)}
                                        checked={checkedStatus[i]['Status']} />
                                    <span className="slider"></span>
                                    <span className="labels" data-on="Active" data-off="Not Active" ></span>
                                </label>
                            </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div><button type="submit" onClick={deployHandler} className="button3">Deploy</button></div>


        </>
    );
};

export default MetadataFetch;