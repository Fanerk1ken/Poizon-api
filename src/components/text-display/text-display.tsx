import React, { useEffect, useState, useCallback, useMemo } from "react";
import styles from "./text-display.module.scss";

interface TextDisplayProps {
    currentText: string;
    typedChars: (string | undefined)[];
    currentIndex: number;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ currentText, typedChars, currentIndex }) => {
    const [visibleLines, setVisibleLines] = useState<string[]>([]);
    const [startLineIndex, setStartLineIndex] = useState(0);

    const linesPerPage = 3;
    const charsPerLine = 60;

    // Разделение текста на строки
    const allLines = useMemo(() => {
        const lines: string[] = [];
        for (let i = 0; i < currentText.length; i += charsPerLine) {
            lines.push(currentText.slice(i, i + charsPerLine));
        }
        return lines;
    }, [currentText]);

    // Обновление видимых линий
    const updateVisibleLines = useCallback(() => {
        const currentLineIndex = Math.floor(currentIndex / charsPerLine);
        let newStartLineIndex = Math.max(0, currentLineIndex - 1);

        // Убедимся, что у нас всегда есть как минимум linesPerPage строк для отображения
        newStartLineIndex = Math.min(newStartLineIndex, allLines.length - linesPerPage);

        setStartLineIndex(newStartLineIndex);
        setVisibleLines(allLines.slice(newStartLineIndex, newStartLineIndex + linesPerPage));
    }, [currentIndex, allLines]);

    // Эффект для обновления видимых линий при изменении currentIndex
    useEffect(() => {
        updateVisibleLines();
    }, [currentIndex, updateVisibleLines]);

    // Отрисовка символов с соответствующей стилизацией
    const renderChar = (char: string, lineIndex: number, charIndex: number) => {
        const globalIndex = (startLineIndex + lineIndex) * charsPerLine + charIndex;
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
                    <div key={startLineIndex + lineIndex} className={styles.line}>
                        {line.split('').map((char, charIndex) => renderChar(char, lineIndex, charIndex))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TextDisplay;