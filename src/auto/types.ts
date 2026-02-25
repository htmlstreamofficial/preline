export type TAutoInitPlugin = {
  autoInit?: () => void;
};

export type TCollectionItem = {
  key: string;
  fn: TAutoInitPlugin | null;
  collection: string;
};