export interface ISpaCollectionItem {
	key: string;
	fn: {
		autoInit: (target?: Document | HTMLElement) => void;
        autoClean: (target?: Document | HTMLElement) => void;
	};
	collection: string;
}
