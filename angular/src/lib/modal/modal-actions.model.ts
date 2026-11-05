import type { Signal } from "@angular/core";
import type { Observable } from "rxjs";
import type { VoteyButtonVariant } from "../button/votey-button.component";
import type { VoteyModalRef } from "./votey-modal-ref";

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
