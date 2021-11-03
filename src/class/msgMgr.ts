import { MsgChat, QMsg, WsMsg } from "../interface/if";
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
		this.process = process;
		this.Send(`in msgMgr process: ${this.process.pid}`);
	}
	private list:Message[] = [];
	Send(msg:string) {
		if(process.send) {
			console.log(msg);
			process.send(msg);
		}
	}
	async Add(userkey:string) {
		let mkey;
		const f = this.list.find(itm => itm.Userkey === userkey);
		if (!f) {
			console.log('msgMgr Add:', userkey);
			const me = new Message(userkey, this);
			mkey = await me.getMKey();
			await me.Get();
			this.list.push(me);
		} else {
			console.log('msgMgr not found:', userkey);
			mkey = await f.getMKey();
			await f.Get();
		}
		const wsg: WsMsg = {
			Func:FuncKey.GET_MKEY,
			UserKey: userkey,
			ChatRoomID: mkey,
		}
		this.Send(JSON.stringify(wsg));
	}
	async SaveMessage(ChatRoomID:string, msg:string) {
		const f = this.list.find(itm => itm.MKey === ChatRoomID);
		if (f) {
			await f.Add(msg);
		}
	}
	async OnMessage(msg:string) {
		const obj = StrFunc.toJSON(msg);
		if(obj) {
			const mc = obj as WsMsg;
			//console.log('OnMessage JSON:', mc);
			console.log(`${mc.Func ? mc.Func : 'default:'}`, mc);
			switch(mc.Func) {
				case FuncKey.SAVE_MESSAGE:		//client send msg
					if(mc.ChatRoomID && mc.Message) this.SaveMessage(mc.ChatRoomID, mc.Message);
					break;
				case FuncKey.GET_MKEY:	// client login
					if(mc.UserKey) await this.Add(mc.UserKey)
					break;
				default:
			}
		} else {
			console.log(`message pass: ${msg}`);
		}
	}
}