// import WebSocket from "ws";
// import IChanelClient from '../../interface/Channel/Client';
import AClient from "./AClient";
// import IChannelSite from '../../interface/Channel/Site';
// import { WsMsg } from "../../interface/if";

export default class Client extends AClient {
	addChannels(channel:string) {
		const f = this.channels.find(c => c === channel);
		if (!f) this.channels.push(channel);
	}
	SendInitMsg() {
				
	}
}