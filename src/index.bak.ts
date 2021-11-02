import WebSocket, { ServerOptions } from 'ws';
import process from 'process';
import dotenv from 'dotenv';
import { IncomingMessage } from 'node:http';
import ChannelMananger from './class/Channel/Manager';

const cm = new ChannelMananger();
dotenv.config();
const port = process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 4000;
const options:ServerOptions = {
	port,
}
const server = new WebSocket.Server(options);

server.on('connection', (ws:WebSocket, req:IncomingMessage)=>{
	// console.log('ws:', ws);
	console.log('req:', req.socket.remoteAddress, req.headers, req.url);
	const errMsg = cm.Add(ws, req.url);
	if (errMsg) {
		ws.send(errMsg, (err) => {
			console.log('send Error:', req.socket.remoteAddress);
		});
		ws.close();
	}
});
server.on('message', (msg) => {
	console.log('server get message', msg.toString());
});
server.on('close', (ws:WebSocket)=>{
	console.log('I am closed:', ws);
})
