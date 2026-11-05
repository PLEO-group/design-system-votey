import { Location } from "@angular/common";
import { Dialog, type DialogRef } from "@angular/cdk/dialog";
import { Injectable, inject, type TemplateRef, type Type } from "@angular/core";
import { filter, take, takeUntil } from "rxjs";
import {
  VOTEY_TRANSLATOR,
  type VoteyTranslator,
} from "../translation/votey-translation";
import type { VoteyModalConfig } from "./modal-config.model";
import { VoteyModalComponent } from "./votey-modal.component";
import { VoteyModalRef } from "./votey-modal-ref";
import {
  VOTEY_MODAL_DATA,
  type VoteyModalTemplateContext,
} from "./modal-content.model";

@Injectable({ providedIn: "root" })
export class VoteyModalService {
  private readonly dialog: Dialog = inject(Dialog);
  private readonly translator: VoteyTranslator = inject(VOTEY_TRANSLATOR);
  private readonly location: Location | null = inject(Location, {
    optional: true,
  });
  private readonly refs: Map<string, VoteyModalRef<unknown>> = new Map<
    string,
    VoteyModalRef<unknown>
  >();

  public open<TData = unknown, TResult = unknown>(
    content:
      | Type<unknown>
      | TemplateRef<VoteyModalTemplateContext<TData, TResult>>
      | null,
    config: VoteyModalConfig<TData, TResult>
  ): VoteyModalRef<TResult> {
    if (config.id && this.refs.has(config.id))
      throw new Error(`Modal '${config.id}' is already open.`);
    let ref: VoteyModalRef<TResult>;
    const dialogRef: DialogRef<unknown, VoteyModalComponent> = this.dialog.open(
      VoteyModalComponent,
      {
        id: config.id,
        maxWidth: "92vw",
        panelClass: "votey-modal-overlay",
        disableClose: true,
        closeOnNavigation: false,
        closeOnOverlayDetachments: false,
        autoFocus: config.autoFocus ?? "first-heading",
        restoreFocus: config.restoreFocus ?? true,
        ariaLabel: this.translator.translate(config.title),
        ariaLabelledBy: null,
        injector: config.injector,
        viewContainerRef: config.viewContainerRef,
        data: { config, content },
        providers: (cdkRef: DialogRef<unknown, VoteyModalComponent>) => {
          ref = new VoteyModalRef<TResult>(cdkRef.id);
          return [
            { provide: VoteyModalRef, useValue: ref },
            { provide: VOTEY_MODAL_DATA, useValue: config.data },
          ];
        },
      }
    );
    const modalRef: VoteyModalRef<TResult> = ref!;
    const componentInstance: VoteyModalComponent = dialogRef.componentInstance!;
    this.refs.set(modalRef.id, modalRef as VoteyModalRef<unknown>);
    dialogRef.backdropClick.pipe(takeUntil(dialogRef.closed)).subscribe(() => {
      if (config.closeOnBackdrop ?? true)
        void modalRef.close(undefined, "backdrop");
    });
    dialogRef.keydownEvents
      .pipe(
        filter(
          (event: KeyboardEvent): boolean =>
            event.key === "Escape" &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.shiftKey
        ),
        takeUntil(dialogRef.closed)
      )
      .subscribe((event: KeyboardEvent): void => {
        if (config.closeOnEscape ?? true) {
          event.preventDefault();
          void modalRef.close(undefined, "escape");
        }
      });
    const stopLocationListener: (() => void) | undefined =
      config.closeOnNavigation ?? true
        ? this.location?.onUrlChange(() => {
            void modalRef.close(undefined, "navigation");
          })
        : undefined;
    dialogRef.closed.pipe(take(1)).subscribe((): void => {
      stopLocationListener?.();
      this.refs.delete(modalRef.id);
      componentInstance.finish();
    });
    return modalRef;
  }

  public confirm<TResult = boolean>(
    config: VoteyModalConfig<unknown, TResult>
  ): VoteyModalRef<TResult> {
    return this.open<unknown, TResult>(null, config);
  }

  public getById(id: string): VoteyModalRef<unknown> | undefined {
    return this.refs.get(id);
  }
}
