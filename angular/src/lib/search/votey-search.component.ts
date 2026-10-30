import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject,
  Input, input, output, type InputSignal, type OutputEmitterRef, type OnInit, type OnDestroy,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { type Subscription } from "rxjs";
import { VoteyFormControlApplyDirective } from "../directives/votey-form-control-apply.directive";
import { VoteyInputComponent } from "../input/votey-input.component";
import { VoteyButtonComponent } from "../button/votey-button.component";

@Component({
  selector: "vt-search",
  templateUrl: "./votey-search.component.html",
  styleUrl: "./votey-search.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyInputComponent, VoteyButtonComponent],
})
export class VoteySearchComponent extends VoteyFormControlApplyDirective<string> implements OnInit, OnDestroy {
  public readonly label: InputSignal<string> = input.required<string>();
  public readonly placeholder: InputSignal<string> = input("LABEL.SEARCH");
  public readonly ariaLabel: InputSignal<string> = input("LABEL.SEARCH");
  public readonly searchLabel: InputSignal<string> = input("LABEL.SEARCH");
  public readonly clearLabel: InputSignal<string> = input("LABEL.TABLE_CLEAR_SEARCH");
  public readonly disabled: InputSignal<boolean> = input(false);
  public readonly id: InputSignal<string> = input("");
  public readonly name: InputSignal<string> = input("");
  public readonly dataCy: InputSignal<string> = input("");
  public readonly searched: OutputEmitterRef<string> = output<string>();
  public readonly cleared: OutputEmitterRef<void> = output<void>();

  private readonly changeDetector: ChangeDetectorRef = inject(ChangeDetectorRef);
  private controlSubscription: Subscription | null = null;
  private initialized: boolean = false;

  @Input() public override set control(control: FormControl<string | null> | null | undefined) {
    super.control = control;
    if (this.initialized) this.observeControl();
  }

  protected get hasValue(): boolean { return (this.formControl.value ?? "").length > 0; }
  protected get isDisabled(): boolean { return this.disabled() || this.formControl.disabled; }

  public ngOnInit(): void {
    this.initialized = true;
    this.observeControl();
  }

  public ngOnDestroy(): void {
    this.initialized = false;
    this.controlSubscription?.unsubscribe();
    this.controlSubscription = null;
  }

  protected submit(): void {
    if (!this.isDisabled) this.searched.emit(this.formControl.value ?? "");
  }

  protected clear(): void {
    if (this.isDisabled || !this.hasValue) return;
    this.formControl.setValue("");
    this.formControl.markAsDirty();
    this.cleared.emit();
  }

  protected keyDown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      this.submit();
    }
  }

  private observeControl(): void {
    this.controlSubscription?.unsubscribe();
    this.controlSubscription = this.formControl.events.subscribe(() => this.changeDetector.markForCheck());
  }
}
