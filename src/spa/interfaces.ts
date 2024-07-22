export interface ISpaCollectionItem {
	key: string;
	fn: {
		autoInit: () => void;
	};
	collection: string;
}
