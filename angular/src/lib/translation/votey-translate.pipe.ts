import { Pipe, type PipeTransform } from "@angular/core";
import {
  injectVoteyTranslator,
  type VoteyTranslationParams,
  type VoteyTranslator,
} from "./votey-translation";

@Pipe({
  name: "vtTranslate",
  standalone: true,
  pure: false,
})
export class VoteyTranslatePipe implements PipeTransform {
  private readonly translator: VoteyTranslator = injectVoteyTranslator();

  public transform(
    key: string | null | undefined,
    params?: VoteyTranslationParams
  ): string {
    return key ? this.translator.translate(key, params) : "";
  }
}
