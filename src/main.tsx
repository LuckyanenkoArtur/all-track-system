import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { PreferencesProvider } from "./context/PreferencesContext";
import { UserProfileProvider } from "./context/UserProfileContext";

// TODO: Remove PreferencesProvider and UserProfileProvider on Redux + LocalStorage + Database storage

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PreferencesProvider>
      <UserProfileProvider>
        <App />
      </UserProfileProvider>
    </PreferencesProvider>
  </StrictMode>,
);
