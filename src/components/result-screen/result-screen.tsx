import React from "react";
import styles from "./result-screen.module.scss";

interface ResultScreenProps {
    wpm: number | null;
    errors: number;
    onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ wpm, errors, onRestart }) => {
    return (
        <div className={styles.resultScreen}>
            <h2>Game Over</h2>
            {wpm !== null && <p>WPM: {wpm}</p>}
            <p>Errors: {errors}</p>
            <button onClick={onRestart}>Start Again</button>
        </div>
    );
};

export default ResultScreen;