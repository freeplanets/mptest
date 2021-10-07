import ASetSql from "./ASetSql";
import { KeyVal, TableData} from "../../interface/if";
import UpdateSqlString from "./UpdateSqlString";

//有 isCanceled 欄位處理方，如果沒有 。。。。 working
export default class RemoveSqlString extends ASetSql<TableData> {
  private static uss: UpdateSqlString = new UpdateSqlString();
  public getSql(t: TableData): string {
    const kv: KeyVal = {key: "isCanceled", value: 1};
    t.updatefields?.push(kv);
    return RemoveSqlString.uss.getSql(t);
  }
}
