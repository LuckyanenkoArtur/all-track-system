import type en from "../../../public/lang/en.json";

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

/** Shape of translation keys derived from `public/lang/en.json`. */
export type TranslationKeys = DeepStringRecord<typeof en>;
