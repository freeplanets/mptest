import { MsgChat, QMsg } from "../interface/if";
import Message from "./Message/Message";
import StrFunc from '../class/Function/MyStr';
import { FuncKey } from "../interface/ENum";

export default class msgMgr {
	private process:NodeJS.Process;
	constructor(process:NodeJS.Process){
		process.on('message',(msg:string)=>{
			// console.log('in msgMgr process message:', msg);
			this.OnMessage(msg);
		});
		if(process.send) {
			console.log('in msgMgr process:', process.pid, 'send');
			process.send(process.pid);
		}
		this.process = process;
	}
	private list:Message[] = [];
	async Add(userkey:string) {
		let mkey;
		const f = this.list.find(itm => itm.Userkey === userkey);
		if (!f) {
			const me = new Message(userkey);
			mkey = await me.getMKey()
			this.list.push(new Message(userkey));
		} else {
			mkey = await f.getMKey();
		}
		return mkey;
	}
	async SaveMessage(userkey:string, msg:QMsg) {
		const f = this.list.find(itm => itm.Userkey === userkey);
		if (f) {
			await f.Add(msg);
		}
	}
	OnMessage(msg:string) {
		const obj = StrFunc.toJSON(msg);
		if(obj) {
			const mc = obj as MsgChat;
			switch(mc.Func) {
				case FuncKey.SET_CHANNEL:		//client add

			}
		} else {
			console.log(`message pass: ${msg}`);
		}
	}
}