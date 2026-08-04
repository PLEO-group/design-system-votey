import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type InputSignal,
  type InputSignalWithTransform,
  numberAttribute,
  type Signal,
} from "@angular/core";

export const VoteyTextVariants = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "body-l",
  "body",
  "body-s",
  "caption",
  "caption-s",
  "micro",
  "button",
  "table-header",
  "label",
] as const;

export const VoteyTextColors = [
  "primary",
  "secondary",
  "muted",
  "inverse",
  "accent",
  "on-sidebar",
] as const;

export type VoteyTextVariant = (typeof VoteyTextVariants)[number];
export type VoteyTextColor = (typeof VoteyTextColors)[number];

@Component({
  selector: "vt-text",
  templateUrl: "./votey-text.component.html",
  styleUrl: "./votey-text.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoteyTextComponent {
  public readonly content: InputSignal<string | number | null | undefined> =
    input.required<string | number | null | undefined>();
  public readonly variant: InputSignal<VoteyTextVariant> =
    input<VoteyTextVariant>("body");
  public readonly color: InputSignal<VoteyTextColor> =
    input<VoteyTextColor>("primary");
  public readonly uppercase: InputSignal<boolean> = input<boolean>(false);
  public readonly italic: InputSignal<boolean> = input<boolean>(false);
  public readonly wrap: InputSignal<boolean> = input<boolean>(false);
  public readonly maxLines: InputSignalWithTransform<number, unknown> = input<
    number,
    unknown
  >(0, { transform: numberAttribute });

  protected readonly lineClampEnabled: Signal<boolean> = computed<boolean>(
    () => !this.wrap() && this.maxLines() > 0
  );
  protected readonly textClasses: Signal<string> = computed<string>(() =>
    [
      "text",
      this.variant(),
      this.color(),
      this.uppercase() ? "uppercase" : "",
      this.italic() ? "italic" : "",
      this.wrap() ? "wrap" : "",
      this.lineClampEnabled() ? "ellipsis" : "",
      this.wrap() || this.lineClampEnabled() ? "constrained" : "",
    ]
      .filter(Boolean)
      .join(" ")
  );
}
