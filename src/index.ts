import WebSocket, { ServerOptions } from 'ws';
import process from 'process';
import dotenv from 'dotenv';
import { IncomingMessage } from 'node:http';
import ChannelMananger from './class/Channel/Manager';

const cm = new ChannelMananger();
interface UInfo {
	site: string;
	UserID: string;
}
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
	
	//const a = chk(req.url);
	//ws.send(JSON.stringify({ key: 'test', site: a.site, UserID: a.UserID}));
	// ws.close();
	/*
	ws.on('close',()=>{
		console.log('client left:', server.clients.size);
	});
	*/
	/*
	server.clients.forEach(client => {
		if(ws !== client) client.send('received');
	});
	*/
});
server.on('message', (msg) => {
	console.log('server get message', msg.toString());
});
server.on('close', (ws:WebSocket)=>{
	console.log('I am closed:', ws);
})
function chk(str?:string) {
	const tmp: UInfo = {
		site: '',
		UserID: '',
	}
	if(str) {
		const sp = str.split('/');
		if(sp[1]) tmp.site = sp[1];
		if(sp[2]) tmp.UserID = sp[2];
	}
	return tmp;
}
