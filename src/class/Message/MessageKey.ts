import sha256 from "sha256";
import { KeyVal, Msg, MsgKey, TableData } from "../../interface/if";
import IfMsgkey from "../../interface/MsgKey";
import Dba from '../DBA/DatabaseAdmin';

export default class MessageKey implements IfMsgkey {
	private jt: Dba;
	private service: boolean;
	private mkey: string;
	constructor(private key: string, private tbname = 'MessageKey') {
		this.jt = new Dba();
		this.service = this.isServiceAcc();
		const shakey = `Key:${this.key}, CreateTime:${new Date().getTime()}`;
		this.mkey = sha256(shakey);
		// console.log("MessageKey constructor", shakey, this.mkey);
	}
	public async List(): Promise<Msg> {
		const param:TableData = { TableName: this.tbname };
		const f: KeyVal = {
			Key: "UserKey",
			Val: this.key,
		};
		if (this.isService) {
			f.Val2 = "";
		}
		param.filter = f;
		const msg = this.jt.select(param);
		return msg;
	}
	public async Add(mkey?: string): Promise<Msg> {
		const MKey: MsgKey = {
			UserKey: this.key,
			MKey: mkey ? mkey : this.MKey,
		};
		const param:TableData = {
			TableName: this.tbname,
			updatefields: MKey,
		}
		const msg = this.jt.add(param);
		return msg;
	}
	get isService() {
		return this.service;
	}
	public async isKeyExist(mkey: string) {
		let isExist = false;
		const filter: KeyVal = {
			UserKey: this.key,
			MKey: mkey,
		};
		const param: TableData = {
			TableName: this.tbname,
			filter,
		}
		const msg = await this.jt.select(param);
		if (msg.affectedRows > 0) isExist = true
		return isExist;
	}
	public isServiceAcc(): boolean {
		let b = false;
		const c: string[] = this.key.split("@");
		if (c[1] === "service") { b = true; }
		return b;
	}
	get MKey() {
		return this.mkey;
	}
}
