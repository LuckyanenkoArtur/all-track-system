import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface UserBio {
  firstName: string;
  lastName: string;
  country: string;
  timezone: string;
  phoneCountryCode: string;
  phone: string;
  username: string;
  role: string;
  email: string;
  avatarUrl: string | null;
}

export interface Device {
  id: string;
  name: string;
  type: "desktop" | "laptop" | "mobile";
  location: string;
  lastLogin: string;
  isCurrent: boolean;
}

interface UserProfileContextValue {
  bio: UserBio;
  devices: Device[];
  updateBio: (bio: UserBio) => void;
  logoutDevice: (id: string) => void;
  logoutAllDevices: () => void;
}

const STORAGE_KEY = "alltrack-user-profile";

const defaultBio: UserBio = {
  firstName: "Felix",
  lastName: "Anderson",
  country: "US",
  timezone: "America/New_York",
  phoneCountryCode: "+1",
  phone: "(555) 123-4567",
  username: "felix.anderson",
  role: "Administrator",
  email: "felix.anderson@alltrack.io",
  avatarUrl:
    "https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=e2e8f0",
};

const defaultDevices: Device[] = [
  {
    id: "1",
    name: 'Dell 24"',
    type: "desktop",
    location: "London, UK",
    lastLogin: "May 12, 2023 at 2:30 AM",
    isCurrent: false,
  },
  {
    id: "2",
    name: "Macbook Air",
    type: "laptop",
    location: "New York, US",
    lastLogin: "Jun 1, 2023 at 9:15 AM",
    isCurrent: true,
  },
  {
    id: "3",
    name: "iPhone 14 Pro Max",
    type: "mobile",
    location: "New York, US",
    lastLogin: "Jun 5, 2023 at 6:45 PM",
    isCurrent: false,
  },
];

function loadProfile(): { bio: UserBio; devices: Device[] } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        bio: { ...defaultBio, ...parsed.bio },
        devices: parsed.devices ?? defaultDevices,
      };
    }
  } catch {
    /* use defaults */
  }
  return { bio: defaultBio, devices: defaultDevices };
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadProfile);

  const updateBio = useCallback((bio: UserBio) => {
    setState((prev) => {
      const next = { ...prev, bio };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logoutDevice = useCallback((id: string) => {
    setState((prev) => {
      const devices = prev.devices.filter((d) => d.id !== id || d.isCurrent);
      const next = { ...prev, devices };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const logoutAllDevices = useCallback(() => {
    setState((prev) => {
      const devices = prev.devices.filter((d) => d.isCurrent);
      const next = { ...prev, devices };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      bio: state.bio,
      devices: state.devices,
      updateBio,
      logoutDevice,
      logoutAllDevices,
    }),
    [state, updateBio, logoutDevice, logoutAllDevices],
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return ctx;
}
