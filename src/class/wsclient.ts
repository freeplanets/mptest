import sha256 from "sha256";
import WebSocket,{Data, ClientOptions} from "ws";
import { WsMsg } from '../interface/if';

console.log(process.argv);
let UserID = '111111';
let Channel = 'member';
if(process.argv[2]) UserID = process.argv[2];
if(process.argv[3]) Channel = process.argv[3];

const opt:ClientOptions = {
	headers: {
		auth: sha256('test1'),
		site: 'localhost:9999',
	},
}
const ws = new WebSocket(`ws://localhost:9999/aaa.bbb.ccc/${Channel}/${UserID}`, opt);
ws.on('open', () => {
	// console.log('open');
	// if(UserID !== '123') {
		const msg:WsMsg = {
			toWho: '123',
			Message: `${UserID} is login!`,
		}	
		ws.send(JSON.stringify(msg), (err) => {
			console.log('client send err', err);
		});	
	// }
})
ws.on('message', (data:Data)=>{
	console.log('message data', data.toString());
	/*
	if(!isSended) {
		ws.send(JSON.stringify(msg));
		isSended = true;
	}
	*/
})
ws.on('error',(data)=>{
	console.log('OnError:', data);
})