import HSFileUpload from "./core";

declare var _: any;
declare var Dropzone: any;

window.addEventListener('load', () => {
  if (document.querySelectorAll('[data-hs-file-upload]:not(.--prevent-on-load-init)').length) {
    if (typeof _ === 'undefined')
      console.error('HSFileUpload: Lodash is not available, please add it to the page.');
    if (typeof Dropzone === 'undefined')
      console.error('HSFileUpload: Dropzone is not available, please add it to the page.');
  }

  if (typeof _ !== 'undefined' && typeof Dropzone !== 'undefined') {
    HSFileUpload.autoInit();
  }
});

if (typeof window !== 'undefined') {
  window.HSFileUpload = HSFileUpload;
}