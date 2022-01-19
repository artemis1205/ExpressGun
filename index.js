const path = require('path');
const express = require('express');
const Gun = require('gun');
require('bullet-catcher')
const SEA = require("gun/sea");
const cors = require('cors')

const port = (process.env.PORT || 8080);
const host = '0.0.0.0';

function hasValidToken(msg) {
    return msg && msg && msg.headers && msg.headers.token && msg.headers.token === 'thisIsTheTokenForReals'
}


const app = express();
app.use(Gun.serve);

const server = app.listen(port, host);

console.log(`server listening on http://${host}:${port}`);


function logIn(msg) {
    console.log("yeet" + msg);
}

function logOut(msg) {
    console.log(`out msg:${JSON.stringify(msg)}.........`);
}

var gun = Gun({
    web: server,
    isValid: hasValidToken
});

gun._.on('in', logIn);
gun._.on('out', logOut);



const view = path.join(__dirname, 'view/main.html');

app.use(express.static('view'));
app.get('*', function(_, res) {
    res.sendFile(view);
});