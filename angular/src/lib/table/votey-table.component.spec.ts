import { Component, signal, type WritableSignal } from "@angular/core";
import { TestBed, type ComponentFixture } from "@angular/core/testing";
import { Dialog } from "@angular/cdk/dialog";
import { Subject } from "rxjs";
import { VoteyTableComponent } from "./votey-table.component";
import type { VoteyTableColumn, VoteyTableQuery } from "./table.model";

interface Row { id: number; name: string; }

@Component({
  selector: "vt-table-test", imports: [VoteyTableComponent],
  template: `<vt-table label="Table" [rows]="rows()" [columns]="columns" [rowKey]="key"
    [selectable]="true" searchMode="remote" (queryChange)="events.push($event)" />`,
})
class TableTestComponent {
  public readonly rows: WritableSignal<Row[]> = signal([{ id: 1, name: "Anna" }, { id: 2, name: "Jan" }]);
  public readonly columns: VoteyTableColumn<Row>[] = [{ id: "name", header: "Name", searchable: true, value: (row: Row): string => row.name }];
  public readonly key: (row: Row) => number = (row: Row): number => row.id;
  public readonly events: VoteyTableQuery[] = [];
}

describe("VoteyTableComponent", () => {
  let fixture: ComponentFixture<TableTestComponent>;
  let closed: Subject<boolean | undefined>;

  beforeEach(async (): Promise<void> => {
    closed = new Subject<boolean | undefined>();
    await TestBed.configureTestingModule({
      imports: [TableTestComponent],
      providers: [{ provide: Dialog, useValue: { open: (): object => ({ closed, close: (result: boolean): void => closed.next(result) }) } }],
    }).compileComponents();
    fixture = TestBed.createComponent(TableTestComponent);
    fixture.detectChanges();
  });

  function table(): VoteyTableComponent<Row> {
    return fixture.debugElement.children[0].componentInstance as VoteyTableComponent<Row>;
  }

  it("keeps selected keys after receiving new objects on another page", (): void => {
    table().selectedKeys.set([1]);
    fixture.componentInstance.rows.set([{ id: 3, name: "Maria" }]);
    fixture.detectChanges();
    expect(table().selectedKeys()).toEqual([1]);
    fixture.componentInstance.rows.set([{ id: 1, name: "Anna" }]);
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('tbody input[type="checkbox"]') as HTMLInputElement).checked).toBe(true);
  });

  it("does not apply filters or clear selection when confirmation is refused", async (): Promise<void> => {
    table().selectedKeys.set([1]);
    const pending: Promise<boolean> = table().requestFilters({ active: true });
    expect(fixture.componentInstance.events).toEqual([]);
    expect(table().selectedKeys()).toEqual([1]);
    closed.next(false);
    expect(await pending).toBe(false);
    expect(table().selectedKeys()).toEqual([1]);
    expect(fixture.componentInstance.events).toEqual([]);
  });

  it("clears selection and emits exactly one accepted filter query", async (): Promise<void> => {
    table().selectedKeys.set([1]);
    const pending: Promise<boolean> = table().requestFilters({ active: true });
    closed.next(true);
    expect(await pending).toBe(true);
    expect(table().selectedKeys()).toEqual([]);
    expect(fixture.componentInstance.events).toEqual([{ page: 0, size: 20, search: "", filters: { active: true } }]);
  });
});
