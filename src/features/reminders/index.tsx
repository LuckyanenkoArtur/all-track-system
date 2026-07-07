import { BreadTitle } from "../../components/bread-title/BreadTitle";
import { useTranslation } from "../../i18n";

export default function RemindersPage() {
  const { t } = useTranslation();

  return <BreadTitle title={t.sidebar.reminders} />;
}
