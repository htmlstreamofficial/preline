import { DropzoneOptions } from 'dropzone';

export interface IFileUploadOptions extends DropzoneOptions {
	extensions?: {};
	autoHideTrigger?: boolean;
	singleton?: boolean;
}

export interface IFileUpload {
	options?: IFileUploadOptions;

	destroy(): void;
}