export interface IBasePlugin<O, E> {
	el: E;
	options?: O;
	events?: {};
}