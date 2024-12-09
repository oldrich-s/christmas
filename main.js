const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const schedule = require('node-schedule');
const player = require('play-sound')();

const app = express();
app.use(bodyParser.json());

let job = null;

app.use(express.static('public'));

app.post('/set-timer', (req, res) => {
    if (job) job.cancel();

    const { targetTime, range } = req.body;
    const [hours, minutes] = targetTime.split(':').map(Number);
    const rangeInMinutes = Number(range);

    const randomOffset = Math.floor((Math.random() * 2 - 1) * rangeInMinutes);

    const targetDate = new Date();
    targetDate.setHours(hours, minutes + randomOffset, 0, 0);

    job = schedule.scheduleJob(targetDate, () => {
        axios.get('http://192.168.1.254/rpc/Switch.Set?id=0&on=true')
        //player.play(`./hudba/*.mp3`);
    });

    res.sendStatus(200);
});

app.get('/next-execution', (req, res) => {
    res.json({ targetDate: job ? job.nextInvocation() : null });
});

app.listen(3000, () => {
    console.log(`Server běží na portu 3000. Zapni Bluetooth audio!!!`);
});
