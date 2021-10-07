import { ErrCode } from "../../interface/ENum";
import { Msg } from "../../interface/if";
import ASetSql from "./ASetSql";
import { getConnection, Query, IAxParams, PoolConnection } from './db';

export default abstract class ADBA<T> {
  constructor(private conn?:PoolConnection) {}
  public abstract add(t: T): void;
  public abstract update(t: T): void;
  public abstract remove(t: T): void;
  public abstract select(t: T):void;
  public abstract getSql(t: T, f: ASetSql<T>): string;
  async Query(sql:string,param?:IAxParams) {
    let msg:Msg={};
    if(!this.conn) {
      this.conn = await getConnection();
    }
    if (this.conn) {
      msg = await Query(sql, this.conn, param);
    } else {
      msg.ErrNo = ErrCode.GET_CONNECTION_ERR;
    }
    return msg;
  }
}
