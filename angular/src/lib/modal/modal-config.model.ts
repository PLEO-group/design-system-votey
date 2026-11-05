import type { Injector, ViewContainerRef } from "@angular/core";
import type { VoteyModalActions } from "./modal-actions.model";
import type { VoteyModalResult, VoteyModalSize } from "./modal.model";

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
