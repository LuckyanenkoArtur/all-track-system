import { BreadTitle } from "../../components/bread-title/BreadTitle";
import { useTranslation } from "../../i18n";

export default function TimingPage() {
  const { t } = useTranslation();

  return <BreadTitle title={t.sidebar.timeTracking} />;
}
