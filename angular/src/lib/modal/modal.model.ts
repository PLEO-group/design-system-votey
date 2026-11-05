export const VoteyModalSizes = ["small", "standard", "wide"] as const;
export type VoteyModalSize = (typeof VoteyModalSizes)[number];
export const VoteyModalCloseReasons = [
  "action",
  "cancel",
  "close-button",
  "backdrop",
  "escape",
  "navigation",
] as const;
export type VoteyModalCloseReason = (typeof VoteyModalCloseReasons)[number];
export interface VoteyModalResult<TResult> {
  readonly reason: VoteyModalCloseReason;
  readonly value: TResult | undefined;
}
