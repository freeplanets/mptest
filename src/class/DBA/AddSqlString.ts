import ASetSql from "./ASetSql";
import { KeyVal, TableData} from "../../interface/if";

export default class AddSqlString extends ASetSql<TableData> {
  public getSql(t: TableData): string {
    let rlt = '';
    if (t.updatefields) {
      const fields: string[] = [];
      const values: string[] = [];      
      t.updatefields.map((itm: KeyVal) => {
        if(itm.key === 'id' && itm.i )
        fields.push(itm.key);
        values.push(typeof(itm.value) === 'string' ? `'${itm.value}'` : `${itm.value}`);
      });
      return `Insert into ${t.TableName}(${fields.join(',')}) values(${values.join(',')})`;      
    }
    return rlt
  }
}
