import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { PreferencesProvider } from "./context/PreferencesContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import { bootstrapI18n, I18nProvider } from "./i18n";

async function startApp() {
  await bootstrapI18n();

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <I18nProvider>
        <PreferencesProvider>
          <UserProfileProvider>
            <App />
          </UserProfileProvider>
        </PreferencesProvider>
      </I18nProvider>
    </StrictMode>,
  );
}

void startApp();
