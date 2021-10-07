import { IncomingMessage } from 'http';
import WebSocket, { ServerOptions, Server } from 'ws';

export default class server {
	private ws:Server;
	private options:ServerOptions;
	constructor(port:string){
		this.options = {
			port: port ? parseInt(port, 10) : 4000,
		}
		this.ws = this.getServer();
	}
	getServer() {
		const ws = new WebSocket.Server(this.options);
		ws.on('error', (ws:Server, args:any[]) => {
			const len = ws.getMaxListeners();
			console.log('MaxListeners', len);
			console.log('error:', JSON.stringify(args));
		});
		ws.on('open', (ws:Server, args:any[])=>{
			console.log('connected', JSON.stringify(args), ',clients', ws.clients);
		});
		ws.on('connection', (ws:WebSocket, request:IncomingMessage) => {

		})
		return ws;
	}
}