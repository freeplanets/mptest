import WebSocket from "ws";
import IChannelSite from '../../interface/Channel/Site';
import ChannelClient from './Client';
import { ClientInfo } from "../../interface/if";

interface AnyChannel {
	[key:string]: ChannelClient[];
}
export default class Site implements IChannelSite {
	private clients:AnyChannel = {};
	constructor(private site:string){}
	get Site() {
		return this.site;
	}
	Add(ws:WebSocket, info:ClientInfo) {
		if(info.site !== this.site) return;
		/*
		const fIdx = this.clients.findIndex(itm => itm.UserID === info.UserID);
		if (fIdx !== -1) {
			if (this.clients[fIdx].isClosed) {
				this.clients.splice(fIdx, 1, new ChannelClient(ws, info.UserID, info.dfChannel, this));
			}
		} else {
			this.clients.push(new ChannelClient(ws, info.UserID, info.dfChannel, this));
		}
		*/
	}
	AddToChannel(ws:WebSocket, channel:string, UserID:string) {
		if( !this.clients[channel]) this.clients[channel] = [];
		const f = this.clients[channel].find(itm => itm.UserID === UserID);
		if (!f) {
			this.clients[channel]	
		}
	}
	Send(msg:string, UserID?:string) {
		/*
		this.clients.map(client => {
			client.Send(msg, UserID);
		})
		*/
	}
}