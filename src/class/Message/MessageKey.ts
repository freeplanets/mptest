import sha256 from "sha256";
import { ErrCode } from "../../interface/ENum";
import { KeyVal, Msg, MsgKey, TableData } from "../../interface/if";
import IfMsgkey from "../../interface/MsgKey";
import Dba from '../DBA/DatabaseAdmin';

export default class MessageKey implements IfMsgkey {
	private jt: Dba;
	// private service: boolean;
	// private mkey: string;
	private param: TableData;
	private mkey = '';
	constructor(private userkey: string, private tbname = 'MessageKey') {
		this.jt = new Dba();
		// this.service = this.isServiceAcc();
		// const shakey = `Key:${this.userkey}, CreateTime:${new Date().getTime()}`;
		// this.mkey = sha256(shakey);
		this.param = { TableName: tbname };
		// console.log("MessageKey constructor", shakey, this.mkey);
	}
	get UserKey() {
		return this.userkey;
	}
	get MKey() {
		return this.mkey;
	}	
	public async getCurMKey():Promise<string> {
		const param:TableData = { ...this.param };
		const f = {
			UserKey: this.userkey,
			isEnd: 0
		};
		param.filter = f;
		param.fields = 'MKey';
		let msg = await this.jt.select(param);
		console.log('getCurMKey:', msg);
		if (msg.ErrNo === ErrCode.PASS) {
			if (msg.data && msg.data.length > 0) {
				// msg.MKey = msg.data[0].MKey;
				this.mkey = msg.data[0].MKey;
			} else {
				const shakey = sha256(`Key:${this.userkey},CreateTime:${new Date().getTime()}`);
				console.log('getCurMKey notfound:', shakey, msg);
				msg = await this.Add(shakey);
				this.mkey = msg.MKey as string;	
			}
		}
		return this.mkey;
	}
	public async Add(mkey:string): Promise<Msg> {
		const MKey: MsgKey = {
			UserKey: this.userkey,
			MKey: mkey,
		};
		const param:TableData = {
			TableName: this.tbname,
			updatefields: MKey,
		}
		const msg = await this.jt.add(param);
		if(msg.ErrNo === ErrCode.PASS) {
			this.mkey = mkey;
			msg.MKey = mkey;
		}
		return msg;
	}
	public async endMessage(ReceiverID:string): Promise<Msg> {
		const param:TableData = { ...this.param };
		const f = {
			UserKey: this.userkey,
			ReceiverID,
			isEnd: 1
		};
		param.updatefields = f;
		return this.jt.update(param);
	}
}
