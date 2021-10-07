import WebSocket from 'ws';
import IChanelClient from '../../interface/Channel/Client';
// import ChannelManager from './Manager';
import IChannelManager from '../../interface/Channel/Manager';
import { ClientInfo, WsMsg } from '../../interface/if';
import StrFunc from '../Function/MyStr';
import { FuncKey } from '../../interface/ENum';

export default abstract class AClient implements IChanelClient {
	protected channels:string[] = [];
	protected toJSON = StrFunc.toJSON;
	constructor(protected ws:WebSocket, protected uInfo:ClientInfo, protected manager:IChannelManager) {
		this.init();
		this.SendInitMsg(`Client ${uInfo.dfChannel} ${this.UserID} create!`);
	}
	abstract addChannels(channel:string):void;
	abstract SendInitMsg(msg?:string):void;
	get UserID() {
		return this.uInfo.UserID;
	}
	get isClosed () {
		return this.ws.readyState > WebSocket.OPEN; 
	}
	init() {
		this.ws.on('message',(msg:any)=>{
			this.onMessage(msg.toString());
			// console.log('got mail:', msg.toString());
		});
		this.ws.on('close',()=>{
			console.log('client left:', this.UserID);
			this.manager.Remove(this.uInfo);
		});
	}	
	Send(msg:string) {
		this.ws.send(msg, (error) => {
			if(error) {
				console.log('Send Error:', error);
			}
		})
	}
	onMessage(msg:string, list?:string[]) {
		const ans:WsMsg | undefined = this.toJSON(msg);
		if (ans) {
			// let list:string|string[] = '';
			if (!list) list = [];
			let toSite = this.uInfo.site;
			if (ans.toSite) toSite = ans.toSite;
			list = list.concat(this.manager.getChannelMember(toSite, ans.ChannelName));
			list = list.concat(this.manager.getChannelMember(toSite, ans.toChannels));	
			if(ans.toWho) {
				list.push(`${ans.toWho}@${this.uInfo.site}`);
			}
			console.log('onMessage list:', list);
			if (list.length>0) this.manager.Send(msg, list);
		}
	}
}