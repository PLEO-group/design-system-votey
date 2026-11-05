import { type Signal } from "@angular/core";
import { ReplaySubject, type Observable } from "rxjs";
import type { ModalController } from "./modal-controller.model";
import type { VoteyModalActions } from "./modal-actions.model";
import type {
  VoteyModalCloseReason,
  VoteyModalResult,
} from "./modal.model";

export class VoteyModalRef<TResult = unknown> {
  private readonly result: ReplaySubject<VoteyModalResult<TResult>> =
    new ReplaySubject<VoteyModalResult<TResult>>(1);
  private controller!: ModalController<TResult>;
  public readonly closed: Observable<VoteyModalResult<TResult>> =
    this.result.asObservable();

  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

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

  /**
   * @internal Wyłącznie do współpracy klas wewnątrz Design Systemu.
   * Aplikacje konsumujące Design System nie mogą korzystać z tej metody.
   */
  public connect(controller: ModalController<TResult>): void {
    this.controller = controller;
  }

  /**
   * @internal Wyłącznie do współpracy klas wewnątrz Design Systemu.
   * Aplikacje konsumujące Design System nie mogą korzystać z tej metody.
   */
  public finish(result: VoteyModalResult<TResult>): void {
    this.result.next(result);
    this.result.complete();
  }
}
