import { useState } from "react";
import { FiLogOut, FiMonitor, FiSmartphone, FiTablet } from "react-icons/fi";
import {
  useUserProfile,
  type Device,
} from "../../../context/UserProfileContext";
import { useTranslation } from "../../../i18n";

function DeviceIcon({ type }: { type: Device["type"] }) {
  switch (type) {
    case "mobile":
      return <FiSmartphone />;
    case "laptop":
      return <FiTablet />;
    default:
      return <FiMonitor />;
  }
}

export default function DevicesTab() {
  const { t } = useTranslation();
  const { devices, logoutDevice, logoutAllDevices } = useUserProfile();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const handleLogout = (id: string) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    window.setTimeout(() => {
      logoutDevice(id);
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 300);
  };

  const handleLogoutAll = () => {
    const ids = devices.filter((d) => !d.isCurrent).map((d) => d.id);
    setRemovingIds(new Set(ids));
    window.setTimeout(() => {
      logoutAllDevices();
      setRemovingIds(new Set());
    }, 300);
  };

  const otherDevices = devices.filter((d) => !d.isCurrent);

  return (
    <div className="user-page__tab-content">
      <div className="user-page__devices-hero">
        <div className="user-page__dialog-icon">
          <FiMonitor />
        </div>
        <h3 className="user-page__section-title">{t.userPage.devices.title}</h3>
        <p className="user-page__section-desc">{t.userPage.devices.subtitle}</p>
      </div>

      {otherDevices.length > 0 && (
        <button
          type="button"
          className="user-page__btn user-page__btn--soft user-page__btn--full"
          onClick={handleLogoutAll}
        >
          {t.userPage.devices.logoutAll}
        </button>
      )}

      <div className="user-page__device-list">
        {devices.length === 0 ? (
          <p className="user-page__empty">{t.userPage.devices.empty}</p>
        ) : (
          devices.map((device) => (
            <div
              key={device.id}
              className={`user-page__device-item${removingIds.has(device.id) ? " user-page__device-item--removing" : ""}`}
            >
              <div className="user-page__device-icon">
                <DeviceIcon type={device.type} />
              </div>
              <div className="user-page__device-info">
                <span className="user-page__device-name">
                  {device.name}
                  {device.isCurrent && (
                    <span className="user-page__device-badge">
                      {t.userPage.devices.currentDevice}
                    </span>
                  )}
                </span>
                <span className="user-page__device-meta">
                  {device.location} — {device.lastLogin}
                </span>
              </div>
              {!device.isCurrent && (
                <button
                  type="button"
                  className="user-page__device-logout"
                  onClick={() => handleLogout(device.id)}
                  aria-label={t.userPage.devices.logout}
                  title={t.userPage.devices.logout}
                >
                  <FiLogOut />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
