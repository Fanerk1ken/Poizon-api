import React, { useEffect, useState, useCallback } from "react";
import styles from "./text-display.module.scss";

interface TextDisplayProps {
    currentText: string;
    typedChars: (string | undefined)[];
    currentIndex: number;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ currentText, typedChars, currentIndex }) => {
    const [visibleLines, setVisibleLines] = useState<string[]>([]);
    const [startIndex, setStartIndex] = useState(0);

    const processText = useCallback(() => {
        const lines: string[] = [];
        let currentLine = '';
        let charCount = 0;

        for (let i = 0; i < currentText.length; i++) {
            currentLine += currentText[i];
            charCount++;

            if (charCount === 60 || i === currentText.length - 1) {
                lines.push(currentLine);
                currentLine = '';
                charCount = 0;
            }
        }

        return lines;
    }, [currentText]);

    useEffect(() => {
        const allLines = processText();
        setVisibleLines(allLines.slice(0, 3));
        setStartIndex(0);
    }, [currentText, processText]);

    useEffect(() => {
        const allLines = processText();
        const currentLineIndex = Math.floor(currentIndex / 60);

        if (currentLineIndex > 0 && currentLineIndex !== startIndex) {
            setStartIndex(currentLineIndex - 1);
            setVisibleLines(allLines.slice(currentLineIndex - 1, currentLineIndex + 2));
        }
    }, [currentIndex, processText, startIndex]);

    const renderChar = (char: string, lineIndex: number, charIndex: number) => {
        const globalIndex = startIndex * 60 + lineIndex * 60 + charIndex;
        let className = styles.character;
        if (globalIndex < currentIndex) {
            className += typedChars[globalIndex] === char ? ` ${styles.correct}` : ` ${styles.incorrect}`;
        } else if (globalIndex === currentIndex) {
            className += ` ${styles.current}`;
        }
        return (
            <span key={charIndex} className={className}>
                {char}
            </span>
        );
    };

    return (
        <div className={styles.textDisplayWrapper}>
            <div className={styles.textDisplayContainer}>
                {visibleLines.map((line, lineIndex) => (
                    <div key={startIndex + lineIndex} className={styles.line}>
                        {line.split('').map((char, charIndex) => renderChar(char, lineIndex, charIndex))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TextDisplay;