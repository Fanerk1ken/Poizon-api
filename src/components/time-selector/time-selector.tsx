import React from 'react';
import styles from './time-selector.module.scss';

interface TimeSelectorProps {
    onTimeSelect: (time: number) => void;
    selectedTime: number;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ onTimeSelect, selectedTime }) => {
    const timeOptions = [15, 30, 60, 120];

    return (
        <div className={styles.timeSelectorContainer}>
            {timeOptions.map(time => (
                <button
                    key={time}
                    onClick={() => onTimeSelect(time)}
                    className={`${styles.timeButton} ${selectedTime === time ? styles.selected : ''}`}
                >
                    {time}
                </button>
            ))}
        </div>
    );
};

export default TimeSelector;