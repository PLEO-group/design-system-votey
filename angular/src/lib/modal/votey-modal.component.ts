import { NgComponentOutlet, NgTemplateOutlet } from "@angular/common";
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import {
  ChangeDetectionStrategy,
  Component,
  ErrorHandler,
  DestroyRef,
  Injector,
  TemplateRef,
  computed,
  inject,
  signal,
  type OnDestroy,
  type Signal,
  type Type,
  type WritableSignal,
} from "@angular/core";
import { from, isObservable, finalize } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { VoteyButtonComponent } from "../button/votey-button.component";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import { VoteyModalRef } from "./votey-modal-ref";
import type { ModalData, VoteyModalTemplateContext } from "./modal-content.model";
import type { VoteyModalActions, VoteyModalCallback } from "./modal-actions.model";
import type {
  VoteyModalCloseReason,
  VoteyModalResult,
} from "./modal.model";

@Component({
  selector: "vt-modal",
  templateUrl: "./votey-modal.component.html",
  styleUrl: "./votey-modal.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[class.small]": 'data.config.size === "small"',
    "[class.wide]": 'data.config.size === "wide"',
  },
  imports: [
    NgComponentOutlet,
    NgTemplateOutlet,
    VoteyButtonComponent,
    VoteyTextComponent,
    VoteyTranslatePipe,
  ],
})
export class VoteyModalComponent implements OnDestroy {
  protected readonly data: ModalData = inject<ModalData>(DIALOG_DATA);
  protected readonly ref: VoteyModalRef = inject(VoteyModalRef);
  protected readonly injector: Injector = inject(Injector);
  private readonly dialogRef: DialogRef = inject(DialogRef);
  private readonly errorHandler: ErrorHandler = inject(ErrorHandler);
  private readonly manualBusy: WritableSignal<boolean> = signal<boolean>(false);
  private readonly callbackPending: WritableSignal<boolean> =
    signal<boolean>(false);
  private readonly closePending: WritableSignal<boolean> =
    signal<boolean>(false);
  protected readonly actions: WritableSignal<VoteyModalActions> =
    signal<VoteyModalActions>(this.data.config);
  private finished: boolean = false;
  private invokingAction: boolean = false;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private acceptedResult: VoteyModalResult<unknown> | undefined;
  private readonly requestBusy: Signal<boolean> = computed<boolean>(() => {
    const source: Signal<boolean> | undefined = this.actions().busy;
    return source ? source() : this.manualBusy();
  });
  public readonly closing: Signal<boolean> = this.closePending.asReadonly();
  public readonly busy: Signal<boolean> = computed<boolean>(
    () => this.requestBusy() || this.callbackPending()
  );
  protected readonly blocked: Signal<boolean> = computed<boolean>(
    () => this.busy() || this.closing()
  );
  protected readonly confirmDisabled: Signal<boolean> = computed<boolean>(
    () => {
      const disabled: boolean | Signal<boolean> | undefined =
        this.actions().confirmDisabled;
      return (
        this.blocked() ||
        !this.actions().onConfirm ||
        (typeof disabled === "function" ? disabled() : disabled ?? false)
      );
    }
  );
  protected readonly hasThirdAction: Signal<boolean> = computed<boolean>(() =>
    Boolean(this.actions().thirdActionText && this.actions().onThirdAction)
  );
  protected readonly hasActions: Signal<boolean> = computed<boolean>(
    () =>
      !this.actions().hideModalActions &&
      Boolean(
        this.actions().confirmText ||
          this.actions().cancelText ||
          this.hasThirdAction()
      )
  );
  protected readonly template: TemplateRef<VoteyModalTemplateContext> | null =
    this.data.content instanceof TemplateRef ? this.data.content : null;
  protected readonly component: Type<unknown> | null =
    this.data.content instanceof TemplateRef ? null : this.data.content;
  protected readonly context: VoteyModalTemplateContext = {
    $implicit: this.data.config.data,
    modal: this.ref,
  };

  constructor() {
    this.ref.connect(this);
  }

  public setBusy(busy: boolean): void {
    if (this.actions().busy)
      throw new Error(
        "This modal uses a bound busy signal; update its owner instead of calling setBusy."
      );
    this.manualBusy.set(busy);
  }

  public updateActions(actions: Partial<VoteyModalActions>): void {
    this.actions.update(
      (current: VoteyModalActions): VoteyModalActions => ({
        ...current,
        ...actions,
      })
    );
  }

  public async close(
    value?: unknown,
    reason: VoteyModalCloseReason = "action"
  ): Promise<boolean> {
    if (
      this.finished ||
      this.requestBusy() ||
      this.closing() ||
      (this.callbackPending() && reason !== "action" && reason !== "cancel")
    )
      return false;
    const result: VoteyModalResult<unknown> = { value, reason };
    this.closePending.set(true);
    try {
      if (
        this.data.config.beforeClose &&
        !(await this.data.config.beforeClose(result))
      )
        return false;
      if (this.finished || this.requestBusy()) return false;
      this.acceptedResult = result;
      this.dialogRef.close();
      return true;
    } catch (error: unknown) {
      this.errorHandler.handleError(error);
      return false;
    } finally {
      this.closePending.set(false);
    }
  }

  protected confirm(): void {
    if (!this.confirmDisabled()) this.runAction(this.actions().onConfirm);
  }

  protected cancel(): void {
    if (this.blocked()) return;
    if (this.actions().onCancel) void this.runAction(this.actions().onCancel);
    else void this.close(undefined, "cancel");
  }

  protected thirdAction(): void {
    if (!this.blocked()) void this.runAction(this.actions().onThirdAction);
  }

  private runAction(callback: VoteyModalCallback | undefined): void {
    if (!callback || this.blocked() || this.finished || this.invokingAction)
      return;
    this.invokingAction = true;
    try {
      const result = callback(this.ref);
      if (!result) {
        this.callbackPending.set(false);
        return;
      }
      if (this.finished) return;
      this.callbackPending.set(true);
      (isObservable(result) ? result : from(result))
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          finalize(() => this.callbackPending.set(false))
        )
        .subscribe({
          error: (error: unknown) => this.errorHandler.handleError(error),
        });
    } catch (error: unknown) {
      this.callbackPending.set(false);
      this.errorHandler.handleError(error);
    } finally {
      this.invokingAction = false;
    }
  }

  public ngOnDestroy(): void {
    this.finished = true;
  }

  /**
   * @internal Wyłącznie do współpracy klas wewnątrz Design Systemu.
   * Aplikacje konsumujące Design System nie mogą korzystać z tej metody.
   */
  public finish(): void {
    this.ref.finish(
      this.acceptedResult ?? { value: undefined, reason: "navigation" }
    );
  }
}
