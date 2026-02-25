import HSDataTable from "./core";

declare var DataTable: any;

window.addEventListener('load', () => {
  if (
    document.querySelectorAll(
      '[data-hs-datatable]:not(.--prevent-on-load-init)',
    ).length
  ) {
    if (typeof jQuery === 'undefined')
      console.error(
        'HSDataTable: jQuery is not available, please add it to the page.',
      );
    if (typeof DataTable === 'undefined')
      console.error(
        'HSDataTable: DataTable is not available, please add it to the page.',
      );
  }

  if (typeof DataTable !== 'undefined' && typeof jQuery !== 'undefined') HSDataTable.autoInit();
});

if (typeof window !== 'undefined') {
  window.HSDataTable = HSDataTable;
}