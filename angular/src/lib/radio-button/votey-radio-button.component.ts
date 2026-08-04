import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  input,
  type InputSignal,
  output,
  type OutputEmitterRef,
  type Signal,
  TemplateRef,
  ViewEncapsulation,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  MatRadioButton,
  type MatRadioChange,
  MatRadioGroup,
} from "@angular/material/radio";
import { MatTooltip } from "@angular/material/tooltip";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";
import {
  injectVoteyTranslator,
  type VoteyTranslator,
} from "../translation/votey-translation";
import { VoteyRadioOptionContentDirective } from "./votey-radio-option-content.directive";

export type VoteyRadioButtonLabelPosition = "before" | "after";

export interface VtRadioOption<T = unknown> {
  readonly label: string;
  readonly value: T;
  readonly disabled?: boolean;
  readonly required?: boolean;
  readonly error?: boolean;
  readonly labelPosition?: VoteyRadioButtonLabelPosition;
  readonly id?: string;
  readonly className?: string;
  readonly dataCy?: string;
}

@Component({
  selector: "vt-radio-button",
  templateUrl: "./votey-radio-button.component.html",
  styleUrl: "./votey-radio-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    MatRadioButton,
    MatRadioGroup,
    MatTooltip,
    NgTemplateOutlet,
    ReactiveFormsModule,
    VoteyTranslatePipe,
  ],
})
export class VoteyRadioButtonComponent {
  private readonly translator: VoteyTranslator = injectVoteyTranslator();
  private readonly optionContents: Signal<
    readonly VoteyRadioOptionContentDirective[]
  > = contentChildren(VoteyRadioOptionContentDirective, {
    descendants: true,
  });

  public readonly options: InputSignal<readonly VtRadioOption[]> =
    input.required<readonly VtRadioOption[]>();
  public readonly control: InputSignal<FormControl> =
    input.required<FormControl>();

  public readonly groupLabelPosition: InputSignal<VoteyRadioButtonLabelPosition> =
    input<VoteyRadioButtonLabelPosition>("after");
  public readonly groupDisabled: InputSignal<boolean> = input<boolean>(false);
  public readonly groupRequired: InputSignal<boolean> = input<boolean>(false);
  public readonly groupClass: InputSignal<string> = input<string>("");
  public readonly tooltip: InputSignal<string> = input<string>("");
  public readonly disabledNote: InputSignal<string> = input<string>("");

  public readonly change: OutputEmitterRef<MatRadioChange> =
    output<MatRadioChange>();

  protected readonly groupAccessibleLabel: Signal<string> = computed<string>(
    () =>
      this.options()
        .map((option) => this.translator.translate(option.label))
        .join(", ")
  );
  protected readonly resolvedTooltip: Signal<string> = computed<string>(() =>
    (this.groupDisabled() ? this.disabledNote() : this.tooltip()).trim()
  );
  protected readonly optionContentTemplates: Signal<
    Readonly<Record<string, TemplateRef<unknown>>>
  > = computed<Readonly<Record<string, TemplateRef<unknown>>>>(() => {
    const templates: Record<string, TemplateRef<unknown>> = {};

    for (const optionContent of this.optionContents()) {
      templates[optionContent.optionId()] = optionContent.templateRef;
    }

    return templates;
  });

  protected handleChange(event: MatRadioChange): void {
    this.change.emit(event);
  }
}
