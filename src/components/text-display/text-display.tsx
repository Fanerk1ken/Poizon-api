import React from "react";
import styles from "./text-display.module.scss";

interface TextDisplayProps {
    currentText: string;
    typedChars: (string | undefined)[];
    extraChars: string[];
    currentIndex: number;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ currentText, typedChars, extraChars, currentIndex }) => {
    if (!currentText) return null;
    const wordsPerLine = 9;
    const words = currentText.split(' ');
    const currentLineIndex = Math.floor(currentIndex / (wordsPerLine * 5));

    const visibleText = words.slice(currentLineIndex * wordsPerLine, (currentLineIndex + 3) * wordsPerLine).join(' ');

    return (
        <div className={styles.textStyle}>
            {visibleText.split('').map((char, index) => {
                const absoluteIndex = index + currentLineIndex * wordsPerLine * 5;
                return (
                    <span
                        key={index}
                        className={`
                            ${typedChars[absoluteIndex] === char ? styles.correct : ''}
                            ${typedChars[absoluteIndex] !== undefined && typedChars[absoluteIndex] !== char ? styles.incorrect : ''}
                            ${absoluteIndex === currentIndex ? styles.current : ''} 
                        `}
                    >
                        {char}
                    </span>
                );
            })}
            {extraChars.map((char, index) => (
                <span
                    key={`extra-${index}`}
                    className={styles.extraChar}
                >
                    {char}
                </span>
            ))}
        </div>
    );
};

export default TextDisplay;