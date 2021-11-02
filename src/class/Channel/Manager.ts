import { Worker } from 'cluster';
import WebSocket from "ws";
// import SiteChannel from './Site';
// import ChannelClient from './Client';
import AClient from "./AClient";
import IChannelManager from '../../interface/Channel/Manager';
import { ClientInfo } from '../../interface/if';
import { Msg } from "../../interface/if";
import { ErrCode } from "../../interface/ENum";
import ClientFactory from './ClientFactory';


interface AnySite {
	[key:string]: AClient;
}
interface AnyChannel {
	[key:string] : string[];
}
interface SiteChannel {
	[key:string]: AnyChannel;
}
export default class Manager implements IChannelManager{
	private clients:AnySite = {};
	private site: SiteChannel = {};
	private topSite = 'AllSite';
	private CF:ClientFactory = new ClientFactory();
	constructor(private worker:Worker){}
	private SendToWorker(msg:string) {
		console.log('Manager SendToWorker', msg);
		this.worker.send(msg);
	}
	Add(ws:WebSocket, url = ''):string | undefined {
		console.log('Manager Add url', url);
		const msg = this.anaUrl(url);
		if(msg.ErrNo === ErrCode.PASS) {
			const info = msg.data as ClientInfo;
			this.AddChannel(info.IDWithSite, info.dfChannel, info.site);
			if (!this.clients[info.IDWithSite]) {
				const client = this.CF.get(ws, info, this);
				console.log(`new user created: ${client.UserKey}`);
				this.worker.send(`new user: ${client.UserKey}`);	
				this.clients[info.IDWithSite] = client;
			}
		}
		return msg.ErrCon;
	}
	get TopSite() {
		return this.topSite;
	}
	AddChannel(userid:string, channel:string, site = this.topSite) {
		if (!this.site[site]) this.site[site] = {};
		if (!this.site[site][channel]) this.site[site][channel] = [];
		const f = this.site[site][channel].find(u => u === userid);
		if (!f) this.site[site][channel].push(userid);
		console.log('allchannel:', this.site);
	}
	private anaUrl(str?:string) {
		const msg:Msg = { ErrNo: ErrCode.PASS };
		const tmp: ClientInfo = {
			site: '',
			dfChannel: '',
			UserID: '',
			IDWithSite: '',
		}
		if(str) {
			const sp = str.split('/');
			if (sp[1]) {
				tmp.site = sp[1];
				if(sp[2]) {
					tmp.dfChannel = sp[2];
					if(sp[3]) {
						tmp.UserID = sp[3];
						tmp.IDWithSite = `${tmp.UserID}@${tmp.site}`;
					} else {
						msg.ErrNo = ErrCode.MISS_PARAMETER;
						msg.ErrCon = 'NO UserID';
					}
				} else {
					msg.ErrNo = ErrCode.MISS_PARAMETER;
					msg.ErrCon = 'NO Default Channel';
				}	
			} else {
				msg.ErrNo = ErrCode.MISS_PARAMETER;
				msg.ErrCon = 'NO Site';
			}
		}
		msg.data = tmp;
		return msg;
	}
	Send(msg:string, ToID:string | string[]) {
		this.SendToWorker(msg);
		console.log('Manager Send:', ToID, msg);
		if(Array.isArray(ToID)) {
			this.SendToList(msg, ToID);
		} else {
			if (this.clients[ToID]) {
				this.clients[ToID].Send(msg);
			}	
		}
	}
	private SendToList(msg:string, list:string[]) {
		list.map(id => {
			if (this.clients[id] !== null) {
				this.clients[id].Send(msg);
			}
		})
	}
	getChannelMember(site:string, channel?:string, wholeSite=false) {
		let list:string[] = [];
		if(channel) {
			const chs = this.site[site][channel];
			if (chs) list = list.concat(chs);
		} else if (wholeSite) {
			list = [];
			Object.keys(this.site[site]).map(key=>{
				list = list.concat(this.site[site][key]);
			})
		}
		return list;
	}
	private removeFromChannel(site:string, channel:string, IDWithSite:string) {
		const fIdx = this.site[site][channel].findIndex(id => id === IDWithSite);
		if (fIdx > -1) {
			this.site[site][channel].splice(fIdx, 1);
		}
	}
	Remove(uInfo:ClientInfo, channels:string[]) {
		this.removeFromChannel(uInfo.site, uInfo.dfChannel, uInfo.IDWithSite);
		if (channels.length>0) {
			channels.map((channel) => {
				this.removeFromChannel(uInfo.site, channel, uInfo.IDWithSite);
			});
		}
		console.log(uInfo.IDWithSite, this.clients[uInfo.IDWithSite].isClosed);
		delete this.clients[uInfo.IDWithSite];
	}
}