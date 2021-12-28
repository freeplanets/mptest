import AClient from "./AClient";

export default class Client extends AClient {
	addChannels(channel:string) {
		const f = this.channels.find(c => c === channel);
		if (!f) this.channels.push(channel);
		this.manager.AddChannel(this.uInfo.IDWithSite, channel, this.uInfo.site);
	}
	SendInitMsg() {
		this.Send(`Welcome ${this.uInfo.IDWithSite}`);
	}
}