import {
  InjectionToken,
  type Injector,
  type Signal,
  type TemplateRef,
  type Type,
  type ViewContainerRef,
} from "@angular/core";
import type { Observable } from "rxjs";
import type { VoteyButtonVariant } from "../button/votey-button.component";
import type { VoteyModalRef } from "./votey-modal-ref";

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
export type VoteyModalCallback<TResult = unknown> = (
  modal: VoteyModalRef<TResult>
) => void | Observable<unknown> | Promise<unknown>;
export interface VoteyModalActions<TResult = unknown> {
  confirmText?: string;
  confirmDataCy?: string;
  onConfirm?: VoteyModalCallback<TResult>;
  confirmVariant?: VoteyButtonVariant;
  confirmDisabled?: boolean | Signal<boolean>;
  cancelText?: string;
  cancelDataCy?: string;
  onCancel?: VoteyModalCallback<TResult>;
  thirdActionText?: string;
  thirdActionDataCy?: string;
  onThirdAction?: VoteyModalCallback<TResult>;
  hideModalActions?: boolean;
  busyText?: string;

  busy?: Signal<boolean>;
}
export interface VoteyModalConfig<TData = unknown, TResult = unknown>
  extends VoteyModalActions<TResult> {
  title: string;
  dataCy?: string;
  description?: string;
  message?: string;
  closeLabel?: string;
  size?: VoteyModalSize;
  id?: string;
  data?: TData;
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  closeOnNavigation?: boolean;
  autoFocus?: "dialog" | "first-tabbable" | "first-heading";
  restoreFocus?: boolean;
  injector?: Injector;
  viewContainerRef?: ViewContainerRef;
  beforeClose?: (
    result: VoteyModalResult<TResult>
  ) => boolean | Promise<boolean>;
}
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
