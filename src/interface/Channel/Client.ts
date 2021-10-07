export default interface Client {
	Send(msg:string):void;
	onMessage(msg:string):void;
	SendInitMsg(msg?:string):void;
}