import AClient from "./AClient";
import { FuncKey, Channels } from "../../interface/ENum";
import { WsMsg } from "../../interface/if";

export default class SettleServer extends AClient {
	addChannels(channel:string) {
		const f = this.channels.find(c => c === channel);
		if (!f) this.channels.push(channel);
	}
	Send(msg:string, UserID?:string) {
		if (UserID && this.UserID !== UserID) return;
		this.ws.send(msg, (error) => {
			if(error) {
				console.log('Send Error:', error);
			}
		})
	}
	SendInitMsg() {
		const list = this.manager.getChannelMember(this.uInfo.site, Channels.API_SERVER);
		if (list.length> 0) {
			const toWho = list[0];
			this.SendFuncKey(FuncKey.GET_CRYPTOITEM_CODE_DISTINCT, toWho);
		}
	}
	private SendFuncKey(fundkey:FuncKey, toWho:string) {
		const wsg:WsMsg = {
			Func: fundkey,
		}
		this.manager.Send(JSON.stringify(wsg), toWho);
	}

}