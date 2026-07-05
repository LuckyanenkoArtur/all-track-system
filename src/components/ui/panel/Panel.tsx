import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
    type FC,
    type PropsWithChildren,
    type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { FiMaximize2, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import styles from "./Panel.module.scss";

type PanelContextValue = {
    onClose: () => void;
    panelRef: RefObject<HTMLElement | null>;
    titleId: string;
    expander?: string;
};

const PanelContext = createContext<PanelContextValue | null>(null);

export const PanelDismissContext = createContext<(() => void) | undefined>(
    undefined,
);

function usePanelContext() {
    const ctx = useContext(PanelContext);
    if (!ctx) throw new Error("Panel subcomponents must be used inside Panel");
    return ctx;
}

interface PanelComponent extends FC<PanelProps> {
    Header: FC<PanelHeaderProps>;
    Title: FC<PropsWithChildren>;
    Desciption: FC<PropsWithChildren>;
    Content: FC<PropsWithChildren>;
}

type PanelProps = PropsWithChildren & {
    open: boolean;
    expander?: string;
};

type PanelHeaderProps = PropsWithChildren;

export const Panel: PanelComponent = ({ children, open: openProp, expander: expander }) => {
    const [open, setOpen] = useState(openProp);

    const onDismiss = useContext(PanelDismissContext);
    const panelRef = useRef<HTMLElement>(null);
    const titleId = useId();

    useEffect(() => {
        setOpen(openProp);
    }, [openProp]);

    const handleClose = useCallback(() => {
        setOpen(false);
        onDismiss?.();
    }, [onDismiss]);

    useEffect(() => {
        if (!open) return;

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") handleClose();
        };

        const content = document.querySelector<HTMLElement>(".content");
        const previousBodyOverflow = document.body.style.overflow;
        const previousContentOverflow = content?.style.overflow ?? "";

        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        if (content) content.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = previousBodyOverflow;
            if (content) content.style.overflow = previousContentOverflow;
        };
    }, [open, handleClose]);

    useEffect(() => {
        if (!open) return;
        panelRef.current?.focus();
    }, [open]);

    if (!open) return null;

    return createPortal(
        <PanelContext.Provider
            value={{ onClose: handleClose, panelRef, titleId, expander: expander }}
        >
            <div className={styles.overlay} role="presentation" onClick={handleClose}>
                <aside
                    ref={panelRef}
                    className={styles.panel}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={titleId}
                    tabIndex={-1}
                    onClick={(event) => event.stopPropagation()}
                >
                    {children}
                </aside>
            </div>
        </PanelContext.Provider>,
        document.body,
    );
};

Panel.Header = ({ children }) => {
    const { onClose, expander: expander } = usePanelContext();
    const navigate = useNavigate();

    const handleExpand = () => {
        if (!expander) return;

        onClose();
        navigate(expander);
    };

    return (
        <header className={styles.header}>
            <div className={styles.headerText}>{children}</div>
            <div className={styles.headerActions}>
                {expander ? (
                    <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={handleExpand}
                        aria-label="Expand"
                    >
                        <FiMaximize2 size={18} aria-hidden />
                    </button>
                ) : null}
                <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={onClose}
                    aria-label="Close"
                >
                    <FiX size={18} aria-hidden />
                </button>
            </div>
        </header>
    );
};

Panel.Title = ({ children }) => {
    const { titleId } = usePanelContext();

    return (
        <h2 id={titleId} className={styles.headerTitle}>
            {children}
        </h2>
    );
};

Panel.Desciption = ({ children }) => {
    return <p className={styles.headerSubtitle}>{children}</p>;
};

Panel.Content = ({ children }) => {
    return <div className={styles.body}>{children}</div>;
};
