import React from 'react';
import styles from './time-selector.module.scss';
import { FaClock } from 'react-icons/fa';

interface TimeSelectorProps {
    onTimeSelect: (time: number) => void;
    selectedTime: number;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ onTimeSelect, selectedTime }) => {
    const timeOptions = [15, 30, 60, 120];

    return (
        <div className={styles.timeSelectorContainer}>
            <FaClock className={styles.clockIcon} />
            {timeOptions.map(time => (
                <button
                    key={time}
                    onClick={() => onTimeSelect(time)}
                    className={`${styles.timeOption} ${selectedTime === time ? styles.active : ''}`}
                >
                    {time}
                </button>
            ))}
        </div>
    );
};

export default TimeSelector;