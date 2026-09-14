import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type InputSignal,
  type Signal,
} from "@angular/core";
import { VoteyTextComponent } from "../text/votey-text.component";
import { VoteyTranslatePipe } from "../translation/votey-translate.pipe";

@Component({
  selector: "vt-form-error",
  templateUrl: "./votey-form-error.component.html",
  styleUrl: "./votey-form-error.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VoteyTextComponent, VoteyTranslatePipe],
})
export class VoteyFormErrorComponent {
  public readonly errors: InputSignal<string[]> = input<string[]>([]);
  public readonly ignoredErrors: InputSignal<string[]> = input<string[]>([]);

  protected readonly visibleErrors: Signal<string[]> = computed<string[]>(() =>
    this.errors()
      .filter(
        (error: string) =>
          !this.ignoredErrors().includes(error) &&
          !this.ignoredErrors().includes(this.toTranslationKey(error))
      )
      .map((error: string) => this.toTranslationKey(error))
  );

  private toTranslationKey(error: string): string {
    return error.startsWith("ERRORS.")
      ? error
      : `ERRORS.${error.toUpperCase()}`;
  }
}
