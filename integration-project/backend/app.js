
const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
require('dotenv').config();
app.use(cors());
app.use(express.json());
const PORT = 3001;

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.post('/token', async (req, res) => {
    console.log('<----------inside token------------->');
    const url = req.body['token-url'];
    console.log('url -->' + url);
    let token;
    let refresh;
    let instance;
    let username;
    try {
        const res1 = await axios.post(url).catch((error) => {
            console.log('inside token error')
            console.log(error);
        });
        instance = res1.data['instance_url'];
        refresh = res1.data['refresh_token'];
        token = res1.data['access_token'];
        const id = res1.data['id'];
        console.log(' refresh-->' + refresh);
        console.log('instance -->' + instance);
        console.log('token-->' + token);
        username = await getUserName(id, token);
        console.log('name-->' + username);

    } catch (error) {
        console.log(' inside token error-2')
    }
    res.send({ 'token': token, 'refresh': refresh, 'instance-url': instance, 'username': username }
    );
});

const metaObject = (name, id, status) => {
    const data = {
        Id: id,
        Name: name,
        Status: status
    };
    return data;
}
const metaObject2 = (errorConditionFormula, errorMessage, active) => {
    const data = {
        "Metadata": {
            "errorConditionFormula": errorConditionFormula,
            "errorMessage": errorMessage,
            "active": active
        }
    };
    return data;
}
const getNewAccessToken = async (refresh) => {
    console.log('inside getnew accesstoken' + refresh);
    const res1 = await axios.post(`https://login.salesforce.com/services/oauth2/token?grant_type=refresh_token&client_id=3MVG9pRzvMkjMb6k26D2AbOW5gVdE.Swyu4dFbiG8JRNg4QfPPGVNcXxTngChHR5BkWtCHZ00zCu06FoJz7XM&refresh_token=${refresh}`).catch((error) => {

        console.log('inside get new access token error');
        console.log(error);

    });
    console.log('here-->');
    const refresh1 = res1.data['refresh_token'];
    const token = res1.data['access_token'];
    console.log('refresh1-->' + refresh1);
    console.log('token-->' + token)
    return ({ 'token': token, 'refresh': refresh1 });
}
const getUserName = async (url, token) => {
    console.log('<----------inside getUserName------------------>')
    console.log('url-->' + url);
    const res1 = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } }).catch((error) => {
        console.log(error);
    });
    const username = res1.data['display_name'];
    return (username);
}
app.post('/update', async (req, res) => {
    console.log('<--------------------------------inside update----------------------------------------->')
    const mydomain = req.body['mydomain'];
    let passedArray = req.body['checkedStatus']
    let token = req.body['token'];
    const refresh = req.body['refresh'];
    let metadata;

    for (let i = 0; i < passedArray.length; i++) {
        let deployArray = [];
        console.log('iteration------------->' + i);
        console.log('passed status of ' + i + 'th array element----------->' + passedArray[i]['Status']);
        //console.log('Id-->' + passedArray[i]['Id']);
        const changedId = passedArray[i]['Id'];
        const status = passedArray[i]['Status'];
        // console.log('token inside /update -->' + token)
        await axios.get(`${mydomain}/services/data/v39.0/tooling/query?q=Select+Id,Description,ErrorMessage,Metadata,Active+From+ValidationRule++WHERE+Id='${changedId}'`, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                let response = res.data;
                const records = response['records'];
                Object.keys(response).forEach(key => {
                    if (key == 'records') {
                        Object.keys(records).forEach(key2 => {
                            metadata = records[key2]['Metadata'];
                            const ErrorMessage = records[key2]['ErrorMessage'];
                            let Active;
                            console.log('original status of ' + i + 'th array element------>' + records[key2]['Active'])
                            if (records[key2]['Active'] != passedArray[i]['Status']) {
                                Active = passedArray[i]['Status'];
                            }
                            else {
                                Active = records[key2]['Active'];
                            }
                            let formula;
                            Object.keys(metadata).forEach(key => {
                                if (key === 'errorConditionFormula')
                                    formula = metadata[key];


                            });

                            deployArray.push(metaObject2(formula, ErrorMessage, Active));

                        });
                    }
                });
                console.log(JSON.stringify(deployArray[0]));
                let body = JSON.stringify(deployArray[0]);
                console.log('changing id--->' + changedId);
                axios.patch(`${mydomain}/services/data/v39.0/tooling/sobjects/ValidationRule/${changedId}`, body, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })
                    .then((res) => {
                        console.log('success' + i)
                    }).catch((error) => {
                        console.log('inside update 2nd axios error');
                        console.log('error.code-->' + error.code);
                        if (error.code === 'ETIMEDOUT') {
                            let accessToken = getNewAccessToken(refresh)
                            console.log(accessToken)
                        }

                    });
            }).catch((error) => {
                console.log('inside update 1st axios  error')
                const refresheddata = getNewAccessToken(refresh);
                console.log('refresheddata-->' + refresheddata);
                console.log('refresheddata[token]-->' + refresheddata['token']);
            });
    }

});
app.post('/meta', async (req, res) => {
    console.log('inside meta')
    let token = req.body['token'];
    const type = req.body['meta'];
    const mydomain = req.body['mydomain'];
    const refresh = req.body['refresh'];
    console.log('meta type-->' + type);
    let response;


    if (type === 'validation') {
        response = await axios.get(`${mydomain}/services/data/v39.0/tooling/query?q=Select+Id,ValidationName,Active+From+ValidationRule`, { headers: { Authorization: `Bearer ${token}` } }).catch((error) => {

            console.log('inside meta error');
            const refresheddata = getNewAccessToken(refresh);
            console.log('refresheddata-->' + refresheddata);
            console.log('refresheddata[token]-->' + refresheddata['token']);

        });
        response = response.data;
        console.log('totalSize-->' + response['totalSize']);
        const records = response['records'];

        let ValArray = [];
        Object.keys(response).forEach(key => {

            if (key == 'records') {
                Object.keys(records).forEach(key2 => {
                    let status = records[key2]['Active'];

                    ValArray.push(metaObject(records[key2]['ValidationName'], records[key2]['Id'], status));

                });
            }
        });
        console.log(ValArray);
        response = ValArray;

    }

    res.send(response);


});
app.post('/logout', async (req, res) => {
    console.log('inside logout')
    let token = req.body['token'];
    const mydomain = req.body['mydomain'];
    let response;
    response = await axios.get(`${mydomain}/services/oauth2/revoke?token=${token}`).catch((error) => {

        console.log('inside logout error')

    });
    res.send('success')
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});