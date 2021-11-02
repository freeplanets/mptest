import { Msg } from "./if";

export default interface Msgkey {
	UserKey:string;
	MKey:string;
	getCurMKey():Promise<Msg>;
	Add(mkey:string): Promise<Msg>;
	endMessage(ReceiverID:string): Promise<Msg>;
}
