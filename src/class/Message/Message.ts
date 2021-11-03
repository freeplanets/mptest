import { ErrCode, FuncKey } from "../../interface/ENum";
import { Msg, QMsg, MsgCont, WsMsg } from "../../interface/if";
import AMessage from "./AMessage";
import MessageCont from './MessageCont';
import msgMgr from "../msgMgr";

export default class Message extends AMessage {
	// private ReceiverID: string;
	private mMgr:msgMgr;
	constructor(userkey:string, mmgr:msgMgr) {
		super(userkey);
		this.mMgr = mmgr;
	}
	get MKey() {
		return this.mKey.MKey;
	}
	public async getMKey() {
		if(!this.MKey) {
			const MKey = await this.mKey.getCurMKey();
			console.log('Message getMKey:', MKey);
			if (MKey) {
				this.mCont = new MessageCont(MKey);
			}
		}
		return this.MKey;
	}
	public async endMessage(ReceiverID: string) {
		return this.mKey.endMessage(ReceiverID)
	}
	public async Get() {
		const msg = await this.mCont.Get();
		if (msg.ErrNo === ErrCode.PASS) {
			if(msg.data && msg.data.length > 0) {
				const datas = msg.data as MsgCont[];
				datas.map((data) => {
					const wsg:WsMsg = {
						Func: FuncKey.MESSAGE,
						ChatRoomID: data.MKey,
						Message: data.MsgCont,
						UserKey: this.mKey.UserKey,
					};
					this.mMgr.Send(JSON.stringify(wsg));
				});
			}
		}
	}
	public async Add(msg:string): Promise<Msg> {
		if(this.MKey) {
			const cont:MsgCont = {
				MKey: this.MKey,
				MsgCont: msg,
			}
			return this.mCont.Add(cont);	
		}
		return { ErrNo:ErrCode.NO_LOGIN };
	}
	public StringID(upid?: number, id?: number): string {
		if (!id) { return ""; }
		const key = upid ? "member" : "service";
		return `${id}@${key}`;
	}
}
