import { type Signal } from "@angular/core";
import { ReplaySubject, type Observable } from "rxjs";
import type {
  VoteyModalActions,
  VoteyModalCloseReason,
  VoteyModalResult,
} from "./modal.model";

export interface ModalController<TResult> {
  readonly busy: Signal<boolean>;
  readonly closing: Signal<boolean>;
  close(value?: TResult, reason?: VoteyModalCloseReason): Promise<boolean>;
  setBusy(busy: boolean): void;
  updateActions(actions: Partial<VoteyModalActions<TResult>>): void;
}

export class VoteyModalRef<TResult = unknown> {
  private readonly result: ReplaySubject<VoteyModalResult<TResult>> =
    new ReplaySubject<VoteyModalResult<TResult>>(1);
  private controller!: ModalController<TResult>;
  public readonly closed: Observable<VoteyModalResult<TResult>> =
    this.result.asObservable();

  public constructor(public readonly id: string) {}

  public get busy(): Signal<boolean> {
    return this.controller.busy;
  }

  public get closing(): Signal<boolean> {
    return this.controller.closing;
  }

  public close(
    value?: TResult,
    reason: VoteyModalCloseReason = "action"
  ): Promise<boolean> {
    return this.controller.close(value, reason);
  }

  public setBusy(busy: boolean): void {
    this.controller.setBusy(busy);
  }

  public updateActions(actions: Partial<VoteyModalActions<TResult>>): void {
    this.controller.updateActions(actions);
  }

  /** @internal */
  public connect(controller: ModalController<TResult>): void {
    this.controller = controller;
  }

  /** @internal */
  public finish(result: VoteyModalResult<TResult>): void {
    this.result.next(result);
    this.result.complete();
  }
}
