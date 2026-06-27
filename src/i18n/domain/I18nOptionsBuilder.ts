import type { InitOptions } from "i18next";
import type { Language } from "./LanguageConfig";

export class I18nOptionsBuilder {
    private options: InitOptions = {};

    setFallbackLanguage(language: Language): this {
        this.options.fallbackLng = language;
        return this;
    }

    setSupportedLanguages(langs: readonly string[]): this {
        this.options.supportedLngs = [...langs];
        return this;
    }

    setNamespaces(ns: string[]): this {
        this.options.ns = ns;
        if (!this.options.defaultNS && ns.length > 0) {
            this.options.defaultNS = ns[0];
        }
        return this;
    }

    setDefaultNamespace(defaultNS: string): this {
        this.options.defaultNS = defaultNS;
        return this;
    }

    setBackend(loadPath: string): this {
        this.options.backend = {
            loadPath,
        };
        return this;
    }

    setDetection(order: string[], caches: string[]): this {
        this.options.detection = {
            order,
            caches,
        };
        return this;
    }

    setInterpolation(escapeValue: boolean): this {
        this.options.interpolation = {
            escapeValue,
        };
        return this;
    }

    setReact(useSuspense: boolean): this {
        this.options.react = {
            useSuspense,
        };
        return this;
    }

    build(): InitOptions {
        return this.options;
    }
}
