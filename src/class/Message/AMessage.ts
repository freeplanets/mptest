import { Msg, QMsg } from "../../interface/if";
import MessageCont from "./MessageCont";
import MessageKey from "./MessageKey";

export default abstract class AMessage {
	protected mCont!:MessageCont;
	protected mKey:MessageKey;
	constructor(private userkey:string){
		this.mKey = new MessageKey(userkey);
	}
	get Userkey() {
		return this.userkey;
	}
	abstract getMKey():Promise<string|undefined>;
	abstract endMessage(ReceiverID: string):Promise<Msg>;
	public abstract Add(msg:QMsg): Promise<Msg>;
	public abstract Get(): Promise<Msg>;
}
