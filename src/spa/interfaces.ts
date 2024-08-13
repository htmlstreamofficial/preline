export interface ISpaCollectionItem {
	key: string;
	fn: {
		autoInit: (target: HTMLElement | null = null) => void;
	};
	collection: string;
}
