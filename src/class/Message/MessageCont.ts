import { Msg, MsgCont, TableData } from "../../interface/if";
import IfMsgCont from "../../interface/MesssageCont";
import Dba from '../DBA/DatabaseAdmin';

export default class MessageCont implements IfMsgCont {
	private param:TableData;
	private dba = new Dba();
	constructor(MKey:string, TableName = 'Messages'){
		this.param = { TableName,
			filter: { MKey },
		}
	}
	async Add(msg:MsgCont):Promise<Msg> {
		const param = { ...this.param };
		param.updatefields = msg;
		return this.dba.add(param);
	}
	async Get():Promise<Msg> {
		return this.dba.select(this.param);
	}
}