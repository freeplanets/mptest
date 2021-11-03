import { Msg } from "./if";

export default interface Msgkey {
	UserKey:string;
	MKey:string;
	getCurMKey():Promise<string>;
	Add(mkey:string): Promise<Msg>;
	endMessage(ReceiverID:string): Promise<Msg>;
}
