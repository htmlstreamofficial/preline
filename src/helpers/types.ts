export type EventProps = {
	detail: string;
};

export type OptionProps = {
	options: {
		toggleLight: string;
		isDark: boolean;
	};
};

export type EventWithProps = Event & EventProps;
