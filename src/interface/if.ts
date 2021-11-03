import { ErrCode, FuncKey } from "./ENum";
export interface AnyObject {
	[key: string]: any;
}
export interface DbAns extends AnyObject {
	affectedRows: number;
	insertId: number;
	warningStatus: number;
}
export interface KeyVal {
	Key?: string;
	Val?: string | number;
	Cond?: string;
	Key2?: string;
	Val2?: string | number;
	CondOr?: string;
	[key: string]: any;
}
export interface TableData {
  TableName: string;
	fields?: string | string[];
  updatefields?: KeyVal | KeyVal[];
	filter?: number | string | KeyVal | KeyVal[];
}
export interface Msg extends AnyObject {
	ErrNo?: ErrCode;
	data?: any;
	debug?: string;
	ErrCon?: string;
	UserID?: number;
}
// quasar chat component data format
export interface QMsg {
	name: string; // for Chat Message 'name' 發話者名稱
	text: string[]; // 訊息 for Chat Message 'text'
	sent?: boolean; // for Chat Message 'sent'
	stamp?: string; // 顯示訊息時間 例: '4 minutes ago' for Chat Message 'stemp'
	// bgColor?:string; // 訊息底色 for Chat Message 'bg-color'
	// txtColor?:string; // 訊息字顏色 for Chat Message 'text-color'
	// avatar?: string; // 發話者圖片（或圖片網址）for Chat Message 'avatar'
	// inMessage?: boolean; // 收訊方用，發話方是否正在輸入訊息 for Chat Message tag q-spinner-dots
}
export interface ChatMsg extends QMsg {
	receiveTime: number|string;
	SenderID: number | string;
	// UpID: number | string;
	ReceiverID?: number;
	MKey?: string;
}
export interface HasID {
	id: number;
	[key: string]: any;
}
export interface MsgCont extends AnyObject {
	id?: number;
	MKey: string;
	MsgCont: string;
}
export interface NameAndText {
	name: string;
	text: string[];
}
export interface MsgKey {
	id?:number;
	UserKey: string;
	MKey: string;
	ReceiverID?: string;
	isEnd?:number;
}
export interface MsgCont {
	MKey:string;
	MsgCont:string;
}
export interface MsgChat {
	Func?: FuncKey;
	Message?: string;
	ChannelName?: string;
	ReceiverID?: string;
	toSite?:string;
	toChannels?:string;
	toWho?:string;	
}
export interface WsMsg extends AnyObject {
	Func?: FuncKey;
	Message?: string;
	ChannelName?: string;
	ChatRoomID?: string;
	ReceiverID?: string;
	UserKey?:string;
	toSite?:string;
	toChannels?:string;
	toWho?:string;
	data?:any;
	// Ask?:AnyObject;
	// Asks?:AnyObject | AnyObject[];
}
export interface ClientInfo {
	site: string;
	dfChannel: string;
	UserID: string;
	IDWithSite: string;
}
