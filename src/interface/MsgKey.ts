import { Msg } from "./if";
export default interface Msgkey {
	List(): Promise<Msg>;
	Add(mkey?: string): Promise<Msg>;
	isKeyExist(mkey: string): Promise<boolean>;
}
