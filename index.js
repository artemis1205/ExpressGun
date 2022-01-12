console.log("If module not found, install express globally `npm i express -g`!");
var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.VCAP_APP_PORT || process.env.PORT || process.argv[2] || 8765;
var express = require('express');
var Gun = require('..');
require('../axe');

var app = express();
app.use(Gun.serve);
app.use(express.static(__dirname));

var server = app.listen(port);
var gun = Gun({ file: 'data', web: server });

global.Gun = Gun; /// make global to `node --inspect` - debug only
global.gun = gun; /// make global to `node --inspect` - debug only

function logIn(msg) {
    console.log(`in msg:${JSON.stringify(msg)}.........`);
}

function logOut(msg) {
    console.log(`out msg:${JSON.stringify(msg)}.........`);
}

var gun = Gun({
    web: server,
    localStorage: true,
    radisk: false
});

gun._.on('in', logIn);
gun._.on('out', logOut);

function logPeers() {
    console.log(`Peers: ${Object.keys(gun._.opt.peers).join(', ')}`);
}

function logData() {
    console.log(`In Memory: ${JSON.stringify(gun._.graph)}`);
}

setInterval(logPeers, 5000); //Log peer list every 5 secs
setInterval(logData, 20000); //Log gun graph every 20 secs


const view = path.join(__dirname, 'view/main.html');

app.use(express.static('view'));
app.get('*', function(_, res) {
    res.sendFile(view);
});