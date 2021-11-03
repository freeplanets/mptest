import ASetSql from "./ASetSql";
import { KeyVal, TableData} from "../../interface/if";

export default class AddSqlString extends ASetSql<TableData> {
  public getSql(t: TableData): string {
    console.log('AddSqlString:', t);
    let rlt = '';
    if (t.updatefields) {
      const tmp:KeyVal | KeyVal[] = t.updatefields;
      let uFields:KeyVal[];
      if(Array.isArray(tmp)) uFields = tmp;
      else {
        uFields = Object.keys(tmp).map((Key) => {
           return { Key, Val: tmp[Key] }
        });
      }
      const fields: string[] = [];
      const values: string[] = [];      
      uFields.map((itm: KeyVal) => {
        if(itm.Key && itm.Key !== 'id') fields.push(itm.Key);
        values.push(typeof(itm.Val) === 'string' ? `'${itm.Val}'` : `${itm.Val}`);
      });
      return `Insert into ${t.TableName}(${fields.join(',')}) values(${values.join(',')})`;      
    }
    return rlt
  }
}
