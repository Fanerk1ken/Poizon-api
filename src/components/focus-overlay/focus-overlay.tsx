import React from 'react';
import styles from './focus-overlay.module.scss';
import { FaMousePointer } from "react-icons/fa";

interface FocusOverlayProps {
    isFocused: boolean;
    onFocus: () => void;
}

const FocusOverlay: React.FC<FocusOverlayProps> = ({ isFocused, onFocus }) => {
    if (isFocused) return null;

    return (
        <div className={styles.overlay} onClick={onFocus}>
            <div className={styles.message}>
                <FaMousePointer className={styles.cursorIcon}/>
                Click here or press any key to focus
            </div>
        </div>
    );
};

export default FocusOverlay;