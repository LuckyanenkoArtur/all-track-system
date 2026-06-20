import AllTrackLogo from '../../../../../components/all-track-logo'
import { useTranslation } from '../../../../../i18n';
import styles from './header.module.scss';

type SidebarHeaderProps = {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

//! We need to move out const { t } = useTranslation(); into props imports or Redux state management
const SidebarHeader = ({ collapsed, setCollapsed }: SidebarHeaderProps) => {
    const { t } = useTranslation();

    return (
        <div className={`${styles.header} ${collapsed ? styles.collapsed : ''}`}>
            <button
                type="button"
                className={styles.logoWrap}
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? t.sidebar.expand : t.sidebar.collapse}
                title={collapsed ? t.sidebar.expand : t.sidebar.collapse}
            >
                <AllTrackLogo collapsed={collapsed} />
            </button>
        </div>
    )
}

export default SidebarHeader