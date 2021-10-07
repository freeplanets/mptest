import Dba from '../DBA/DatabaseAdmin';
import { ErrCode } from "../../interface/ENum";
import { ChatMsg, Msg, MsgCont, NameAndText, TableData } from "../../interface/if";
import AMessage from "./AMessage";
import MessageKey from "./MessageKey";

export default class Message extends AMessage {
	get MKey() {
		return this.mkey;
	}
	private jt: Dba;
	private UserKey: string;
	// private ReceiverID: string;
	private cont: string;
	private MK: MessageKey;
	private mkey?: string;
	constructor(SMsg: ChatMsg, private tbname = 'Messages') {
		super();
		this.UserKey = this.StringID(SMsg.UpID, SMsg.SenderID);
		// this.ReceiverID = this.StringID(SMsg.UpID, SMsg.ReceiverID);
		const nameText: NameAndText = {
			name: SMsg.name,
			text: SMsg.text,
		};
		if (SMsg.MKey) { this.mkey = SMsg.MKey; }
		this.cont = JSON.stringify(nameText);
		// this.MKey = MKey ? MKey : this.sha256;
		this.MK = new MessageKey(this.UserKey);
		this.jt = new Dba();
	}
	public async Get(): Promise<Msg> {
		let msg: Msg = { ErrNo: ErrCode.PASS };
		if (this.MKey) {
			const param: TableData = { TableName: this.tbname };
			param.filter = {Key: "MKey", Val: this.MKey };
			msg = await this.jt.select(param);
		}
		return msg;
	}
	public async Add(): Promise<Msg> {
		let msg: Msg = {};
		if (!this.mkey) {
			this.mkey = await this.getMKey();
		}
		if (this.mkey) {
			const isMKeyExist = await this.MK.isKeyExist(this.mkey);
			if (isMKeyExist) {
				const param:TableData = { TableName: this.tbname };
				const msgC: MsgCont = {
					MsgCont: this.cont,
					MKey: this.mkey,
				};
				param.updatefields = msgC
				msg = await this.jt.add(param);
			} else {
				msg.ErrNo = ErrCode.DB_QUERY_ERROR;
				msg.ErrCon = "MKey check exist error!!";
			}
		} else {
			msg.ErrNo = ErrCode.DB_QUERY_ERROR;
			msg.ErrCon = "MKey create error!!";
		}
		return msg;
	}
	public StringID(upid?: number, id?: number): string {
		if (!id) { return ""; }
		const key = upid ? "member" : "service";
		return `${id}@${key}`;
	}
	public SwitchSender(v: MsgCont) {
		const newV = Object.assign({}, v);
		newV.ReceiverID = v.SenderID;
		newV.SenderID = v.ReceiverID;
		return newV;
	}
	private async getMKey(): Promise<string | undefined> {
		let mkey: string|undefined;
		const msg = await this.MK.Add();
		if (msg.ErrNo === ErrCode.PASS) { mkey = this.MK.MKey; }
		return mkey;
	}
}
