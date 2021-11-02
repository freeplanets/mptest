import WebSocket from "ws";
import AClient from "./AClient";
import { WsMsg, ClientInfo } from "../../interface/if"
import { Channels, FuncKey } from "../../interface/ENum";
import IChannelManager from '../../interface/Channel/Manager';

export default class ApiServer extends AClient {
	addChannels(channel:string) {
		const f = this.channels.find(c => c === channel);
		if (!f) this.channels.push(channel);
	}
	Send(msg:string) {
		this.ws.send(msg, (error) => {
			if(error) {
				console.log('Send Error:', error);
			}
		})
	}
	onMessage(msg:string) {
		const ans:WsMsg | undefined = this.toJSON(msg);
		console.log('ApiServer onMessage', ans);
		if(ans) {
			let list:string[] | undefined;
			if (ans.Ask) {
				if (ans.ProcStatus > 1) {
					list = [`${ans.Ask.UserID}@${this.uInfo.site}`];
				}
			}
			console.log('ApiServer onMessage list', list);
			super.onMessage(msg, list);
		}
	}
	SendInitMsg() {
		// this.SendFuncKey(FuncKey.GET_CRYPTOITEM_CODE_DISTINCT, this.uInfo.IDWithSite);
		this.Send(`Welcome ${this.uInfo.IDWithSite}`);
	}
	private SendFuncKey(fundkey:FuncKey, toWho:string) {
		const wsg:WsMsg = {
			Func: fundkey,
			toWho,
		}
		this.Send(JSON.stringify(wsg));
	}

}