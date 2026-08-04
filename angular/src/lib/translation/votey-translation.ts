import { inject, InjectionToken } from "@angular/core";

export type VoteyTranslationParams = Record<string, string | number>;

export interface VoteyTranslator {
  translate(key: string, params?: VoteyTranslationParams): string;
}

const VOTEY_IDENTITY_TRANSLATOR: VoteyTranslator = {
  translate: (key: string): string => key,
};

export const VOTEY_TRANSLATOR: InjectionToken<VoteyTranslator> =
  new InjectionToken<VoteyTranslator>("VOTEY_TRANSLATOR", {
    providedIn: "root",
    factory: (): VoteyTranslator => VOTEY_IDENTITY_TRANSLATOR,
  });

export function injectVoteyTranslator(): VoteyTranslator {
  return (
    inject(VOTEY_TRANSLATOR, { optional: true }) ?? VOTEY_IDENTITY_TRANSLATOR
  );
}
