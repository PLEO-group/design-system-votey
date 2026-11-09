import type { VoteyIllustration } from "../votey-assets";

export interface VoteyHelpPopoverSection {
  readonly heading?: string;
  readonly paragraphs: readonly string[];
}

export interface VoteyHelpPopoverContent {
  readonly title: string;
  readonly illustration?: VoteyIllustration;
  readonly sections: readonly VoteyHelpPopoverSection[];
  readonly action?: { readonly label: string; readonly href: string };
}
