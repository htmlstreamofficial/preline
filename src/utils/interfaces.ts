export interface IMenuSearchHistory {
	historyIndex: number;

	addHistory(index: number): void;
	existsInHistory(index: number): boolean;
	clearHistory(): void;
}
