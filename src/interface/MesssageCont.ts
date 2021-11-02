import { Msg, MsgCont } from "./if";

export default interface MessageCont {
	Add(msg:MsgCont):Promise<Msg>;
	Get():Promise<Msg>;
}