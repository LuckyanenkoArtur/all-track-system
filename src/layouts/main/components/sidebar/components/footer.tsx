import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../../../../i18n";
import { logout } from "../../../../../auth/auth";

import { FiLogOut } from "react-icons/fi";
import styles from "./footer.module.scss";

type SidebarFooterProps = {
    collapsed: boolean;
};

//! We need to move out const { t } = useTranslation(); into props imports or Redux state management
const SidebarFooter = ({ collapsed }: SidebarFooterProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className={`${styles.footer} ${collapsed ? styles.collapsed : ""}`}>
            <button type="button" className={styles.logout} onClick={handleLogout}>
                <div className={styles.iconBox}>
                    <FiLogOut className={styles.icon} />
                </div>
                <span className={styles.label}>{t.common.logout}</span>
            </button>
        </div>
    )
}

export default SidebarFooter