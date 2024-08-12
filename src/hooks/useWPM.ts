import { useState, useEffect, useCallback } from 'react';

export const useWPM = (startTime: number | null, isFinished: boolean) => {
    const [wpm, setWPM] = useState<number | null>(null);
    const [charCount, setCharCount] = useState(0);
    const [errorCount, setErrorCount] = useState(0);

    const addChar = useCallback(() => {
        setCharCount(prev => prev + 1);
    }, []);

    const addError = useCallback(() => {
        setErrorCount(prev => prev + 1);
    }, []);

    const resetCounts = useCallback(() => {
        setCharCount(0);
        setErrorCount(0);
        setWPM(null);
    }, []);

    useEffect(() => {
        if (!startTime) {
            resetCounts();
            return;
        }

        if (isFinished) {
            const timeElapsed = (Date.now() - startTime) / 60000; // время в минутах
            const correctChars = Math.max(charCount - errorCount, 0);
            const words = correctChars / 5;
            const finalWPM = Math.round(words / timeElapsed);
            setWPM(finalWPM);
        }
    }, [startTime, isFinished, charCount, errorCount]);

    return { wpm, addChar, addError, resetCounts };
};