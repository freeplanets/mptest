import { KeyVal } from "../../interface/if";

export default abstract class AFilter {
  public abstract setFilter(filter: string|KeyVal|KeyVal[]): string;
}
