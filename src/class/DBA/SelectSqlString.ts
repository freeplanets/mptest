import { TableData } from '../../interface/if';
import ASetSql from './ASetSql';
import FilterFactory from '../SqlMaker/FilterFactory';

export default class SelectSqlString extends ASetSql<TableData> {
	getSql(t:TableData) {
		let rlt = '';
		let fields = '*';
		if (t.fields) {
			if (Array.isArray(t.fields)) {
				fields = t.fields.join(',');
			} else {
				fields = t.fields;
			}
		}
		let filter = '1';
		if (t.filter) {
			filter = new FilterFactory(t.filter).getFilter();
		}
		rlt = `Select ${fields} from ${t.TableName} where ${filter}`;
		return rlt;
	}
}