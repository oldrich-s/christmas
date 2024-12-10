const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const exec = require('util').promisify(require('child_process').exec);

const app = express();
app.use(bodyParser.json());

let handle = null;
let timeoutMins = null;

app.use(express.static('public'));

app.post('/set-timer', (req, res) => {
    if (handle) clearInterval(handle);

    timeoutMins = Number(req.body.timeoutMins);

    handle = setInterval(async () => {
        timeoutMins = timeoutMins - 1;
        if (timeoutMins > 0) return

        timeoutMins = null;
        clearInterval(handle);

        await exec("BluetoothDevicePairing.exe pair-by-mac --mac 2c:2b:f9:8d:3f:a2 --type Bluetooth").catch(() => {});
        exec('"c:/Program Files (x86)/VideoLAN/VLC/vlc.exe" hudba').catch(() => {});
        fetch('http://192.168.1.254/rpc/Switch.Set?id=0&on=true');
    }, 60_000);

    res.sendStatus(200);
});

app.get('/remaining-mins', async (req, res) => {
    res.status(200).send({ timeoutMins });
});

app.get('/turn-on-lights', async (req, res) => {
    await fetch('http://192.168.1.254/rpc/Switch.Set?id=0&on=true');

    res.sendStatus(200);
});

app.get('/turn-off-lights', async (req, res) => {
    await fetch('http://192.168.1.254/rpc/Switch.Set?id=0&on=false');

    res.sendStatus(200);
});

app.listen(80, () => {
    console.log(`Server běží na portu 80.`);
});
