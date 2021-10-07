import { Msg } from "../../interface/if";
export default abstract class AMessage {
	public abstract Add(): Promise<Msg>;
	public abstract Get(): Promise<Msg>;
}
