import { InjectionToken, type TemplateRef, type Type } from "@angular/core";
import type { VoteyModalConfig } from "./modal-config.model";
import type { VoteyModalRef } from "./votey-modal-ref";

export interface VoteyModalTemplateContext<TData = unknown, TResult = unknown> {
  $implicit: TData | undefined;
  modal: VoteyModalRef<TResult>;
}
export const VOTEY_MODAL_DATA: InjectionToken<unknown> =
  new InjectionToken<unknown>("VOTEY_MODAL_DATA");


export interface ModalData {
  config: VoteyModalConfig;
  content: Type<unknown> | TemplateRef<VoteyModalTemplateContext> | null;
}
