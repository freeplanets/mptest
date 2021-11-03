export default interface Client {
	ChatRoomID:string;
	Send(msg:string):void;
	onMessage(msg:string):void;
	SendInitMsg(msg?:string):void;
}