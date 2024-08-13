export interface ISpaCollectionItem {
	key: string;
	fn: {
		autoInit: () => void;
        autoClean: (target?: Document | HTMLElement) => void;
	};
	collection: string;
}
