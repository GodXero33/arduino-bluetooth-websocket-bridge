const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const serial = new SerialPort({ path: 'COM4', baudRate: 9600 });
const parser = serial.pipe(new ReadlineParser({ delimiter: '\n' }));

const clients = [];
let isLightOn = false;

app.use(express.static('public'));

serial.on('open', () => console.log('Serial Port Open'));

/* parser.on('data', (data) => {
	const message = data.toString().trim();

	console.log('From Arduino:', message);

	wss.clients.forEach(client => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	});
}); */

wss.on('connection', (ws, req) => {
	// const ip = req.socket.remoteAddress;
	const forwardedFor = req.headers['x-forwarded-for']; // Get IP from x-forwarded-for header (Ngrok or other proxies)
	const ip = forwardedFor ? forwardedFor.split(',')[0] : req.socket.remoteAddress;

	console.log(`New WebSocket client connected from IP: ${ip}`);
	clients.push(ws);

	ws.send(JSON.stringify({ status: isLightOn }));

	ws.on('message', event => {
		const data = JSON.parse(event);

		isLightOn = data.status;

		serial.write(isLightOn ? 'ON\n' : 'OFF\n');

		const stringifyData = JSON.stringify(data);

		clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) client.send(stringifyData);
		});
	});

	ws.on('close', () => {
		console.log(`WebSocket client disconnected`);
	});
});

server.listen(8080, () => {
	console.log('Server running: http://localhost:8080')
});
