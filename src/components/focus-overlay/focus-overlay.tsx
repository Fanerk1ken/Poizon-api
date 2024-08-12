import React, { useEffect } from 'react';
import styles from './focus-overlay.module.scss';

interface FocusOverlayProps {
    isFocused: boolean;
    onFocus: () => void;
}

const FocusOverlay: React.FC<FocusOverlayProps> = ({ isFocused, onFocus }) => {


    useEffect(() => {
        const handleKeyDown = () => {
            if (!isFocused) {
                onFocus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFocused, onFocus]);

    if (isFocused) return null;

    return (
        <div className={styles.overlay} onClick={onFocus}>
            <div className={styles.message}>
                Click here or press any key to focus
            </div>
        </div>
    );
};

export default FocusOverlay;