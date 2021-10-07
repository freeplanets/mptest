import WebSocket from "ws";
import { ClientInfo } from "../if";

export default interface Site {
	Add( ws:WebSocket, info:ClientInfo):void;
	Send(msg:string, UserID?:string):void;
}