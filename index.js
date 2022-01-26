const path = require('path');
const express = require('express');
const Gun = require('gun');
const SEA = require("gun/sea");
require('bullet-catcher')

const cors = require('cors')
const bodyParser = require('body-parser')
const stripe = require('stripe')('sk_test_51KA0UmIxrCLGcFjgvXNaPk4CRvaAJ0oQQREi9yABWzGWwxyplAgQop6YyL27xhdSqLqxpImZwISbyGGZ6r456RqF00N0Zx6l6c');

const port = (process.env.PORT || 8080);
const host = '0.0.0.0';

function hasValidToken(msg) {
    return msg && msg && msg.headers && msg.headers.token && msg.headers.token === 'thisIsTheTokenForReals'
}

const app = express();
app.use(Gun.serve);



app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())



const server = app.listen(port, host);

console.log(`server listening on http://${host}:${port}`);

function logIn(msg) {
    console.log(`in msg:${JSON.stringify(msg)}.........`);
}

function logOut(msg) {
    console.log(`out msg:${JSON.stringify(msg)}.........`);
}

var gun = Gun({
    web: server,
    localStorage: false,
    radisk: false,
    isValid: hasValidToken
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

gun.on('out', { get: { '#': { '*': '' } } })

app.use(express.static('view'));
app.get('*', function(_, res) {
    res.sendFile(view);
});

app.post('/sub1', async (req, res) => {
  const {email, payment_method} = req.body;

  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: 'price_1KLuNhIxrCLGcFjgnEpwvgFa' }],
    expand: ['latest_invoice.payment_intent']
  });
  
  const status = subscription['latest_invoice']['payment_intent']['status'] 
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

  res.json({'client_secret': client_secret, 'status': status, 'customer': customer.id, 'sub': subscription.id});
})

app.post('/sub2', async (req, res) => {
  const {email, payment_method} = req.body;

  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: 'price_1KM66QIxrCLGcFjgJ4zkYiLT' }],
    expand: ['latest_invoice.payment_intent']
  });
  
  const status = subscription['latest_invoice']['payment_intent']['status'] 
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

  res.json({'client_secret': client_secret, 'status': status, 'customer': customer.id, 'sub': subscription.id});
})

app.post('/sub3', async (req, res) => {
  const {email, payment_method} = req.body;

  const customer = await stripe.customers.create({
    payment_method: payment_method,
    email: email,
    invoice_settings: {
      default_payment_method: payment_method,
    },
  });

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: 'price_1KM66sIxrCLGcFjgPvjHr9zX' }],
    expand: ['latest_invoice.payment_intent']
  });
  
  const status = subscription['latest_invoice']['payment_intent']['status'] 
  const client_secret = subscription['latest_invoice']['payment_intent']['client_secret']

  res.json({'client_secret': client_secret, 'status': status, 'customer': customer.id, 'sub': subscription.id});
})

app.post('/cancel', async (req, res) => {
    const {sub} = req.body;
    
    const cancler = await stripe.subscriptions.del(sub);
    
    res.json({'client_secret': cancler['client_secret']})
})


