import cluster, { Cluster, Worker } from 'cluster';
import { IncomingMessage } from 'http';
import WebSocket, { ServerOptions, Server } from 'ws';
import ChannelManager from './Channel/Manager';

export default class server {
	private ws:Server;
	private options:ServerOptions;
	private cm!:ChannelManager;
	private main!:Cluster;
	private worker!:Worker;
	constructor(port:string){
		this.options = {
			port: port ? parseInt(port, 10) : 4000,
		}
		this.ws = this.getServer();
	}
	getServer() {
		const ws = new Server(this.options);
		ws.on('error', (ws:Server, args:any[]) => {
			const len = ws.getMaxListeners();
			console.log('MaxListeners', len);
			console.log('error:', JSON.stringify(args));
		});
		ws.on('open', (ws:Server, args:any[])=>{
			console.log('connected', JSON.stringify(args), ',clients', ws.clients);
		});
		ws.on('connection', (ws:WebSocket, request:IncomingMessage) => {
			console.log('req:', request.socket.remoteAddress, request.headers, request.url);
			// console.log('req:', request.url);
			const errMsg = this.cm.Add(ws, request.url);
			if (errMsg) {
				ws.send(errMsg, (err) => {
					console.log('Error:', request.socket.remoteAddress);
				});
				ws.close();
			}
		})
		return ws;
	}
	SendToWork(msg:string) {
		this.worker.send(msg);
	}
	set MainProcess(c:Cluster) {
		this.main = c;
	}
	set Worker(w:Worker) {
		this.worker = w;
		this.cm = new ChannelManager(this.worker);
		this.worker.send('in server worker');
	}
}