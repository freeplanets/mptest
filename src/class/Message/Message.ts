import { ErrCode } from "../../interface/ENum";
import { Msg, QMsg, MsgCont } from "../../interface/if";
import AMessage from "./AMessage";
import MessageCont from './MessageCont';

export default class Message extends AMessage {
	// private ReceiverID: string;
	private mkey?: string;
	public async getMKey() {
		if(!this.mkey) {
			const msg = await this.mKey.getCurMKey();
			console.log('Message getMKey', msg);
			if (msg.ErrNo === ErrCode.PASS) {
				this.mkey = msg.data[0].MKey;
				if(this.mkey)	this.mCont = new MessageCont(this.mkey);
			}
		}
		return this.mkey;
	}
	public async endMessage(ReceiverID: string) {
		return this.mKey.endMessage(ReceiverID)
	}
	public async Get(): Promise<Msg> {
		return this.mCont.Get();
	}
	public async Add(msg:QMsg): Promise<Msg> {
		if(this.mkey) {
			const cont:MsgCont = {
				MKey: this.mkey,
				MsgCont: JSON.stringify(msg),
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
