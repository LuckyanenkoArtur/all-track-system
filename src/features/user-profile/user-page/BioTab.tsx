import { useCallback, useEffect, useRef, useState } from "react";
import { FiCamera, FiLock } from "react-icons/fi";
import { ConfirmDialog } from "../components/dialogs/Dialog";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useTranslation } from "../../../i18n";
import {
  useUserProfile,
  type UserBio,
} from "../../../context/UserProfileContext";
import {
  countries,
  getCountryByCode,
  timezones,
} from "../../../data/countries";

interface BioTabProps {
  isDirty: boolean;
  onDirtyChange: (dirty: boolean) => void;
}

export default function BioTab({ isDirty, onDirtyChange }: BioTabProps) {
  const { t } = useTranslation();
  const { bio: savedBio, updateBio } = useUserProfile();
  const [form, setForm] = useState<UserBio>(savedBio);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(savedBio);
    onDirtyChange(false);
  }, [savedBio, onDirtyChange]);

  const updateField = useCallback(
    <K extends keyof UserBio>(key: K, value: UserBio[K]) => {
      setForm((prev) => {
        const next = { ...prev, [key]: value };
        const dirty = JSON.stringify(next) !== JSON.stringify(savedBio);
        onDirtyChange(dirty);
        return next;
      });
    },
    [savedBio, onDirtyChange],
  );

  const handleCountryChange = (code: string) => {
    const country = getCountryByCode(code);
    setForm((prev) => {
      const next = {
        ...prev,
        country: code,
        phoneCountryCode: country.dialCode,
      };
      onDirtyChange(JSON.stringify(next) !== JSON.stringify(savedBio));
      return next;
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField("avatarUrl", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    updateBio(form);
    onDirtyChange(false);
    setShowSaveConfirm(false);
  };

  const selectedCountry = getCountryByCode(form.country);

  return (
    <div className="user-page__tab-content user-page__tab-content--bio">
      {/* Avatar */}
      <div className="user-page__avatar-section">
        <div className="user-page__avatar-wrap">
          {form.avatarUrl ? (
            <img src={form.avatarUrl} alt="" className="user-page__avatar" />
          ) : (
            <div className="user-page__avatar user-page__avatar--placeholder">
              <FiCamera />
            </div>
          )}
          <button
            type="button"
            className="user-page__avatar-edit"
            onClick={() => fileInputRef.current?.click()}
            aria-label={t.userPage.bio.uploadPhoto}
          >
            <FiCamera />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="user-page__file-input"
            onChange={handleAvatarChange}
          />
        </div>
        <div className="user-page__avatar-actions">
          <button
            type="button"
            className="user-page__link-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            {t.userPage.bio.uploadPhoto}
          </button>
          {form.avatarUrl && (
            <button
              type="button"
              className="user-page__link-btn user-page__link-btn--danger"
              onClick={() => updateField("avatarUrl", null)}
            >
              {t.userPage.bio.removePhoto}
            </button>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <section className="user-page__section">
        <div className="user-page__section-header">
          <h3 className="user-page__section-title">
            {t.userPage.bio.personalInfo}
          </h3>
          <p className="user-page__section-desc">
            {t.userPage.bio.personalInfoDesc}
          </p>
        </div>
        <div className="user-page__grid">
          <div className="user-page__field">
            <label className="user-page__label">
              {t.userPage.bio.firstName}
            </label>
            <input
              className="user-page__input"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
            />
          </div>
          <div className="user-page__field">
            <label className="user-page__label">
              {t.userPage.bio.lastName}
            </label>
            <input
              className="user-page__input"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />
          </div>
          <div className="user-page__field">
            <label className="user-page__label">{t.userPage.bio.country}</label>
            <select
              className="user-page__select"
              value={form.country}
              onChange={(e) => handleCountryChange(e.target.value)}
            >
              <option value="" disabled>
                {t.userPage.bio.selectCountry}
              </option>
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="user-page__field">
            <label className="user-page__label">
              {t.userPage.bio.timezone}
            </label>
            <select
              className="user-page__select"
              value={form.timezone}
              onChange={(e) => updateField("timezone", e.target.value)}
            >
              <option value="" disabled>
                {t.userPage.bio.selectTimezone}
              </option>
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="user-page__section">
        <div className="user-page__section-header">
          <h3 className="user-page__section-title">
            {t.userPage.bio.contactInfo}
          </h3>
          <p className="user-page__section-desc">
            {t.userPage.bio.contactInfoDesc}
          </p>
        </div>
        <div className="user-page__grid">
          <div className="user-page__field user-page__field--phone">
            <label className="user-page__label">{t.userPage.bio.phone}</label>
            <div className="user-page__phone-row">
              <select
                className="user-page__select user-page__select--dial"
                value={form.phoneCountryCode}
                onChange={(e) =>
                  updateField("phoneCountryCode", e.target.value)
                }
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.dialCode}>
                    {c.dialCode}
                  </option>
                ))}
              </select>
              <input
                className="user-page__input"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder={selectedCountry.phonePlaceholder}
              />
            </div>
          </div>
          <div className="user-page__field">
            <label className="user-page__label">
              {t.userPage.bio.username}
            </label>
            <input
              className="user-page__input user-page__input--readonly"
              value={form.username}
              readOnly
            />
            <span className="user-page__hint">
              {t.userPage.bio.usernameHint}
            </span>
          </div>
        </div>
      </section>

      {/* Account Info */}
      <section className="user-page__section">
        <div className="user-page__section-header">
          <h3 className="user-page__section-title">
            {t.userPage.bio.accountInfo}
          </h3>
          <p className="user-page__section-desc">
            {t.userPage.bio.accountInfoDesc}
          </p>
        </div>
        <div className="user-page__grid">
          <div className="user-page__field">
            <label className="user-page__label">{t.userPage.bio.role}</label>
            <input
              className="user-page__input user-page__input--readonly"
              value={form.role}
              readOnly
            />
          </div>
          <div className="user-page__field">
            <label className="user-page__label">{t.userPage.bio.email}</label>
            <input
              className="user-page__input user-page__input--readonly"
              value={form.email}
              readOnly
            />
          </div>
        </div>
        <button
          type="button"
          className="user-page__btn user-page__btn--outline"
          onClick={() => setShowPasswordDialog(true)}
        >
          <FiLock />
          {t.userPage.bio.changePassword}
        </button>
      </section>

      {/* Save bar */}
      <div
        className={`user-page__save-bar${isDirty ? " user-page__save-bar--visible" : ""}`}
      >
        <button
          type="button"
          className="user-page__btn user-page__btn--ghost"
          onClick={() => {
            setForm(savedBio);
            onDirtyChange(false);
          }}
        >
          {t.common.cancel}
        </button>
        <button
          type="button"
          className="user-page__btn user-page__btn--primary"
          onClick={() => setShowSaveConfirm(true)}
        >
          {t.userPage.bio.saveChanges}
        </button>
      </div>

      <ConfirmDialog
        open={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSave}
        title={t.userPage.bio.confirmSaveTitle}
        message={t.userPage.bio.confirmSaveMessage}
        confirmLabel={t.common.confirm}
        cancelLabel={t.common.cancel}
      />

      <ChangePasswordDialog
        open={showPasswordDialog}
        onClose={() => setShowPasswordDialog(false)}
      />
    </div>
  );
}
