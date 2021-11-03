import WebSocket from "ws";
import { ClientInfo } from "../if";

export default interface Manager {
	Add(ws:WebSocket, url:string):string | undefined;
	AddChannel(userid:string, channel:string, site:string):void;
	Send(msg:string, ToID:string | string[], ChatRoomID?:string):void;
	getChannelMember(site:string, channel?:string):string[];
	Remove(uInfo:ClientInfo, channels:string[]):void;
	SendToWorker(msg:string, ChatRoomID:string):void;
}