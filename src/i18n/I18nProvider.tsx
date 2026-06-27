import { type ReactNode, Suspense } from "react";
import { I18nextProvider } from "react-i18next";

import { i18nService } from "./core/I18nService";

type I18nProviderProps = {
  children: ReactNode;
};

function I18nLoadingFallback() {
  return null;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return (
    <I18nextProvider i18n={i18nService.instance}>
      <Suspense fallback={<I18nLoadingFallback />}>{children}</Suspense>
    </I18nextProvider>
  );
}

export async function bootstrapI18n(): Promise<void> {
  await i18nService.initialize();
}
