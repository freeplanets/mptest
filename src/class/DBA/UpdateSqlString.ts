import ASetSql from "./ASetSql";
import { KeyVal, TableData } from "../../interface/if";
import FilterFactory from "../SqlMaker/FilterFactory";

export default class UpdateSqlString extends ASetSql<TableData> {
  public getSql(t: TableData): string {
    let rlt = '';
    if(t.filter && t.updatefields) {
      const filter = new FilterFactory(t.filter).getFilter();
      const updates = this.groupField(t.updatefields);
      rlt = `update ${t.TableName} set ${updates} where ${filter}`;  
    }
    return rlt;
  }
  private groupField(fields:KeyVal | KeyVal[]):string {
    let ans:string[]=[];
    if (Array.isArray(fields)) {
      ans = fields.map((kv) => {
        const val = typeof kv.Val === 'string' ?  `'${kv.Val}'` : `${kv.Val}`;
        return `${kv.Key} = ${val}`;
      })
    } else {
      ans = Object.keys(fields).map(key => {
        const val = typeof fields[key] === 'string' ? `'${fields[key]}'` : `${fields[key]}`;
        return `${key} = `;
      })
    }
    return ans.join(',');
  }
}
