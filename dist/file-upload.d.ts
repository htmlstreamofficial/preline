import { DropzoneOptions } from 'dropzone';

export interface IBasePlugin<O, E> {
	el: E;
	options?: O;
	events?: {};
}
declare class HSBasePlugin<O, E = HTMLElement> implements IBasePlugin<O, E> {
	el: E;
	options: O;
	events?: any;
	constructor(el: E, options: O, events?: any);
	createCollection(collection: any[], element: any): void;
	fireEvent(evt: string, payload?: any): any;
	on(evt: string, cb: Function): void;
}
export interface ICollectionItem<T> {
	id: string | number;
	element: T;
}
export interface IFileUploadOptions extends DropzoneOptions {
	extensions?: {};
	autoHideTrigger?: boolean;
	singleton?: boolean;
}
export interface IFileUpload {
	options?: IFileUploadOptions;
}
declare class HSFileUpload extends HSBasePlugin<IFileUploadOptions> implements IFileUpload {
	private concatOptions;
	private previewTemplate;
	private extensions;
	private singleton;
	dropzone: Dropzone | null;
	constructor(el: HTMLElement, options?: IFileUploadOptions, events?: {});
	private init;
	private initDropzone;
	private onAddFile;
	private previewAccepted;
	private onRemoveFile;
	private onUploadProgress;
	private onComplete;
	private setIcon;
	private createIcon;
	private formatFileSize;
	private splitFileName;
	static getInstance(target: HTMLElement | string, isInstance?: boolean): HTMLElement | ICollectionItem<HSFileUpload>;
	static autoInit(): void;
}

export {
	HSFileUpload as default,
};

export {};
