import { ChangeDetectorRef, Directive, Input, OnDestroy, OnInit, signal, type WritableSignal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";

const PICKER_ERRORS = [
  "voteyPickerFormat", "voteyPickerDate", "voteyPickerTime",
  "voteyPickerRange", "voteyPickerPolicy", "voteyPickerConfig",
] as const;

export type PickerError = Partial<Record<(typeof PICKER_ERRORS)[number], unknown>>;

@Directive()
export abstract class PickerControl extends VoteyFormControlApplyDirective<string> implements OnInit, OnDestroy {
  protected readonly draft: WritableSignal<string> = signal("");
  protected readonly committed: WritableSignal<string | null> = signal(null);
  protected readonly opened: WritableSignal<boolean> = signal(false);
  private valueSubscription: Subscription | null = null;
  private statusSubscription: Subscription | null = null;
  private editing = false;
  private connectedControl: FormControl<string | null> | null = null;

  protected constructor(private readonly changeDetector: ChangeDetectorRef) {
    super();
  }

  @Input() override set control(control: FormControl<string | null> | null | undefined) {
    super.control = control;
    this.connectControl();
  }

  public ngOnInit(): void {
    this.connectControl();
  }

  public ngOnDestroy(): void {
    this.valueSubscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();
  }

  protected abstract formatCommitted(value: string | null): string;
  protected abstract validateCommitted(value: string | null): PickerError | null;
  protected abstract commitDraft(value: string): { value: string | null; error: PickerError | null };

  protected get isDisabled(): boolean {
    return this.formControl.disabled;
  }

  protected get hasError(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  protected get errorKeys(): string[] {
    return this.hasError ? Object.keys(this.formControl.errors ?? {}) : [];
  }

  protected updateDraft(event: Event): void {
    this.editing = true;
    this.draft.set((event.target as HTMLInputElement).value);
    this.applyPickerError(null);
  }

  protected finishDraft(): void {
    if (this.isDisabled) return;
    this.formControl.markAsTouched();
    if (this.editing) {
      const result = this.commitDraft(this.draft().trim());
      if (result.error) {
        this.applyPickerError(result.error);
      } else {
        this.formControl.setValue(result.value);
        this.committed.set(result.value);
        this.editing = false;
        this.draft.set(this.formatCommitted(result.value));
        this.applyPickerError(this.validateCommitted(result.value));
      }
    } else {
      this.applyPickerError(this.validateCommitted(this.formControl.value));
    }
    this.changeDetector.markForCheck();
  }

  protected setCommitted(value: string | null): void {
    if (this.isDisabled) return;
    this.editing = false;
    this.formControl.setValue(value);
    this.committed.set(value);
    this.formControl.markAsTouched();
    this.draft.set(this.formatCommitted(value));
    this.applyPickerError(this.validateCommitted(value));
  }

  protected refreshValidation(): void {
    this.applyPickerError(this.validateCommitted(this.formControl.value));
    this.changeDetector.markForCheck();
  }

  protected refreshDisplay(): void {
    if (!this.editing) this.draft.set(this.formatCommitted(this.formControl.value));
  }

  protected showDraftError(error: PickerError): void {
    this.applyPickerError(error);
    this.formControl.markAsTouched();
    this.changeDetector.markForCheck();
  }

  private connectControl(): void {
    if (this.connectedControl === this.formControl) return;
    this.valueSubscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();
    this.connectedControl = this.formControl;
    this.editing = false;
    this.committed.set(this.formControl.value);
    this.draft.set(this.formatCommitted(this.formControl.value));
    this.valueSubscription = this.formControl.valueChanges.subscribe((value: string | null): void => {
      this.editing = false;
      this.committed.set(value);
      this.draft.set(this.formatCommitted(value));
      this.refreshValidation();
    });
    this.statusSubscription = this.formControl.statusChanges.subscribe((): void => {
      if (this.formControl.disabled) this.opened.set(false);
      this.changeDetector.markForCheck();
    });
    this.refreshValidation();
  }

  private applyPickerError(error: PickerError | null): void {
    const remaining = { ...(this.formControl.errors ?? {}) };
    for (const key of PICKER_ERRORS) delete remaining[key];
    const next = { ...remaining, ...error };
    const current = this.formControl.errors ?? {};
    if (JSON.stringify(next) !== JSON.stringify(current)) {
      this.formControl.setErrors(Object.keys(next).length ? next : null);
    }
  }
}
