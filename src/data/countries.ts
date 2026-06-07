export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  phoneFormat: string;
  phonePlaceholder: string;
}

export const countries: CountryOption[] = [
  {
    code: "US",
    name: "United States",
    dialCode: "+1",
    phoneFormat: "(###) ###-####",
    phonePlaceholder: "(555) 123-4567",
  },
  {
    code: "GB",
    name: "United Kingdom",
    dialCode: "+44",
    phoneFormat: "#### ######",
    phonePlaceholder: "7911 123456",
  },
  {
    code: "DE",
    name: "Germany",
    dialCode: "+49",
    phoneFormat: "### #######",
    phonePlaceholder: "151 1234567",
  },
  {
    code: "FR",
    name: "France",
    dialCode: "+33",
    phoneFormat: "# ## ## ## ##",
    phonePlaceholder: "6 12 34 56 78",
  },
  {
    code: "RU",
    name: "Russia",
    dialCode: "+7",
    phoneFormat: "(###) ###-##-##",
    phonePlaceholder: "(999) 123-45-67",
  },
  {
    code: "UA",
    name: "Ukraine",
    dialCode: "+380",
    phoneFormat: "## ### ## ##",
    phonePlaceholder: "67 123 45 67",
  },
  {
    code: "KZ",
    name: "Kazakhstan",
    dialCode: "+7",
    phoneFormat: "(###) ###-##-##",
    phonePlaceholder: "(701) 123-45-67",
  },
  {
    code: "BY",
    name: "Belarus",
    dialCode: "+375",
    phoneFormat: "## ###-##-##",
    phonePlaceholder: "29 123-45-67",
  },
];

export const timezones = [
  { value: "America/New_York", label: "Eastern Time (US)" },
  { value: "America/Chicago", label: "Central Time (US)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Moscow", label: "Moscow (MSK)" },
  { value: "Asia/Almaty", label: "Almaty (ALMT)" },
  { value: "Asia/Tashkent", label: "Tashkent (UZT)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
];

export function getCountryByCode(code: string) {
  return countries.find((c) => c.code === code) ?? countries[0];
}
