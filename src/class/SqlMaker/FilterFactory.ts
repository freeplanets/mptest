import { KeyVal } from "../../interface/if";
import AFilter from "./AFilter";
import KeyValArrayFilter from "./KeyValArrayFilter";
import KeyValFilter from "./KeyValFilter";
import StringFilter from "./StringFilter";

export default class FilterFactory {
  private filter: string;
  constructor(filter: number | string | KeyVal | KeyVal[]) {
    let af: AFilter;
    switch (typeof filter) {
      case "number":
        filter = `id = ${filter}`;
      case "string":
        af = new StringFilter();
        break;
      default:
        if (Array.isArray(filter)) {
          af = new KeyValArrayFilter();
        } else {
          af = new KeyValFilter();
        }
    }
    this.filter = af.setFilter(filter);
  }
  public getFilter() {
    return this.filter;
  }
}
