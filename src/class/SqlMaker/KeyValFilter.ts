import { KeyVal } from "../../interface/if";
import AFilter from "./AFilter";

/**
 * Cond 不同於 '=' 的條件， 如果是 'between' 必需有 Val2 值
 * 如果有 CondOr 則 Key Val 要有 Key1 Val1
 */
export default class KeyValFilter extends AFilter {
  public setFilter(filter: KeyVal): string {
    if (filter.Key) {
      return this.hasKeyElement(filter);
    } else {
      return this.noKeyElement(filter);
    }
  }
  private hasKeyElement(f: KeyVal): string {
    if (f.CondOr) { return this.doCondOrFilterHasKey(f); }
    return this.hasKeyElementNoCondOr(f);
  }
  private hasKeyElementNoCondOr(f: KeyVal): string {
    let str = this.addQuotationMarks(f.Val);
    if (f.Cond) {
      switch (f.Cond.toLowerCase()) {
        case "between":
          str = `${str} and ${this.addQuotationMarks(f.Val2)}`;
          break;
        case "or":
          return this.KeyEqualOR(f);
        case "in":
          return `${f.Key} in (${f.Val})`;
        case "like":
          return `${f.Key} like '%${f.Val}%'`;
      }
    } else {
      f.Cond = "=";
    }
    return ` ${f.Key} ${f.Cond} ${str} `;
  }
  private KeyEqualOR(f: KeyVal) {
    let fields: string[] = [];
    let filter = "";
    if (f.Key) {
      if (f.Val2 !== undefined) {
        filter = `(${f.Key} = ${this.addQuotationMarks(f.Val)} or ${f.Key} = ${this.addQuotationMarks(f.Val2)})`;
      } else {
        fields = f.Key.split(",");
        const filters = fields.map((field) => {
          return `${field} = ${this.addQuotationMarks(f.Val)}`;
        });
        filter = `(${filters.join(" or ")})`;
      }
    } else {
      filter = `${f.Key} = ${this.addQuotationMarks(f.Val)}`;
    }
    return filter;
  }
  private addQuotationMarks(v: any): string {
    let tmp = v;
    if (typeof(v) === "string") {
      if (v.indexOf("(") === -1) { tmp = `'${v}'`; }
    }
    return tmp;
  }
  private noKeyElement(filter: KeyVal): string {
    if (filter.CondOr || filter.Cond) { return this.doCondOrFilter(filter); }
    return this.noKeyElementNoCondOr(filter);
  }
  private noKeyElementNoCondOr(filter: KeyVal): string {
    const tmp = Object.keys(filter).map((key) => {
      let ftr = "";
      switch (typeof filter[key]) {
          case "number":
              ftr = `${key} = ${filter[key]}`;
              break;
          case "boolean":
              ftr = `${key}`;
              break;
          default:
              ftr = `${key} = '${filter[key]}'`;
      }
      return ftr;
    });
    return tmp.join(" and ");
  }
  private doCondOrFilter(filter: KeyVal) {
    const newfilter: KeyVal[] = [];
    let ans = "";
    Object.keys(filter).map((key) => {
      if (key !== "CondOr" && key !== "Cond") {
        const tmp: KeyVal = {};
        tmp.Key = key;
        tmp.Val = filter[key];
        if (filter.Cond) {
          tmp.Cond = filter.Cond;
        }
        newfilter.push(tmp);
      }
    });
    if (newfilter.length) {
      const filters = newfilter.map((kv) => {
        return this.hasKeyElementNoCondOr(kv);
      });
      ans = `(${filters.join(" or ")})`;
    }
    return ans;
  }
  private doCondOrFilterHasKey(filter: KeyVal) {
    let ans = "";
    if (filter.Key && filter.Val && filter.Key2 && filter.Val2) {
      let Cond = "=";
      if (filter.Cond) { Cond = filter.Cond; }
      const filters: string[] = [];
      filters.push(this.hasKeyElementNoCondOr({Key: filter.Key, Val: filter.Key, Cond}));
      filters.push(this.hasKeyElementNoCondOr({Key: filter.Key2, Val: filter.Key2, Cond}));
      ans = `(${filters.join(" or ")})`;
    }
    return ans;
  }
}
