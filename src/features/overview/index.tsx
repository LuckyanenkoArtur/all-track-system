import { Title } from "../../components/ui/title/Title";
import { useTranslation } from "../../i18n";

export default function OverviewPage() {
  const { t } = useTranslation();

  return <Title text={t.sidebar.dashboard} />;
}
