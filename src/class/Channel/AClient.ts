import WebSocket from 'ws';
import IfChanelClient from '../../interface/Channel/Client';
// import ChannelManager from './Manager';
import IfChannelManager from '../../interface/Channel/Manager';
import { ClientInfo, WsMsg } from '../../interface/if';
import StrFunc from '../Function/MyStr';
import { Channels, FuncKey } from '../../interface/ENum';
import sha256 from 'sha256';

export default abstract class AClient implements IfChanelClient {
	protected channels:string[] = [];
	protected curChatID = '';
	constructor(protected ws:WebSocket, protected uInfo:ClientInfo, protected manager:IfChannelManager) {
		this.init();
		this.SendInitMsg(`Client ${uInfo.dfChannel} ${this.UserID} create!`);
	}
	get ChatRoomID() {
		return this.curChatID;
	}
	set ChatRoomID(crid:string) {
		console.log('AClient Set ChatRoomID:', crid);
		this.curChatID = crid;
	}
	abstract addChannels(channel:string):void;
	abstract SendInitMsg(msg?:string):void;
	get UserKey() {
		return this.uInfo.IDWithSite;
	}
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
			this.manager.Remove(this.uInfo, this.channels);
		});
	}	
	Send(msg:string) {
		console.log('AClient Send to', this.uInfo.UserID, msg);
		this.ws.send(msg, (error) => {
			if(error) {
				console.log('Send Error:', error);
			}
		})
	}
	onMessage(msg:string, list?:string[]) {
		const ans:WsMsg | undefined = this.toJSON(msg);
		console.log('onMessage', msg);
		if (ans) {
			// let list:string|string[] = '';
			switch(ans.Func) {
				case FuncKey.SET_CHANNEL:
					console.log(ans);
					if(ans.ChannelName) this.addChannels(ans.ChannelName);
					break;
				default:
					if (!list) list = [];
					let toSite = this.uInfo.site;
					// if (!this.curChatID) {
						if(ans.toWho) {
							list.push(`${ans.toWho}@${this.uInfo.site}`);
						} else if (ans.toChannels) {
							list = list.concat(this.manager.getChannelMember(toSite, ans.toChannels));
						} else if (this.uInfo.dfChannel === Channels.MEMBER) {
							list = list.concat(this.manager.getChannelMember(toSite, Channels.SERVICE));
						}	
					//}
					console.log('onMessage list:', list);
					/*
					if (!this.curChatID) this.curChatID = this.createChatRoomID();
					ans.ChatRoomID = this.curChatID;
					*/
					if (list.length>0) this.manager.Send(JSON.stringify(ans), list, this.curChatID);
					else {
						this.manager.SendToWorker(JSON.stringify(ans), this.curChatID);
						this.Send('No service man online!!');
					}
			}
		}
	}
	protected toJSON(str:string) {
		return StrFunc.toJSON(str);
	}
	private createChatRoomID():string {
		return sha256(`${this.uInfo.IDWithSite}-${new Date().getTime()}`);
	}
}