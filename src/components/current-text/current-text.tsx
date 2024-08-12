import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { resetState, setCurrentText } from "../../redux/typingSlice";
import GameArea from "../game-area";
import ResultScreen from "../result-screen";
import TimeSelector from "../time-selector";
import FocusOverlay from "../focus-overlay";
import styles from "./current-text.module.scss";
import axios from 'axios';
import { InputHandlerHandle } from "../../types/input-handler";
import { useWPM } from '../../hooks/useWPM';

const CurrentText: React.FC = () => {
    const dispatch = useDispatch();
    const { currentText, currentIndex, errors } = useSelector((state: RootState) => state.typing);

    const [selectedTime, setSelectedTime] = useState<number>(15);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [typedChars, setTypedChars] = useState<(string | undefined)[]>([]);
    const [extraChars, setExtraChars] = useState<string[]>([]);
    const [shouldFocus, setShouldFocus] = useState<boolean>(false);
    const [isTimeManuallySelected, setIsTimeManuallySelected] = useState<boolean>(false);

    const [startTime, setStartTime] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState<boolean>(false);

    const { wpm, addChar, addError, resetCounts } = useWPM(startTime, isFinished);

    const gameAreaRef = useRef<InputHandlerHandle>(null);
    const isInitialRender = useRef(true);

    const formatText = useCallback((text: string): string => {
        return text.toLowerCase().replace(/[.,]/g, "").trim();
    }, []);

    const setFocus = useCallback(() => {
        setShouldFocus(true);
    }, []);

    const fetchRandomWords = useCallback(async () => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            try {
                const response = await axios.get('https://fish-text.ru/get', {
                    params: {
                        type: 'paragraph',
                        number: 3,
                        format: 'json'
                    }
                });
                if (response.data && response.data.status === 'success' && response.data.text) {
                    const formattedText = formatText(response.data.text);
                    dispatch(setCurrentText(formattedText));
                } else {
                    console.error('Unexpected response format:', response.data);
                }
            } catch (error) {
                console.error('Failed to fetch random words:', error);
            }
        }
    }, [dispatch, formatText]);

    const startNewGame = useCallback(() => {
        dispatch(resetState());
        setIsFinished(false);
        setStartTime(null);
        setTimeLeft(null);
        setTypedChars([]);
        setExtraChars([]);
        setIsTimeManuallySelected(false);
        isInitialRender.current = true;
        resetCounts();
        fetchRandomWords();
        setFocus();
        if (gameAreaRef.current) {
            gameAreaRef.current.resetLastSpaceIndex();
        }
    }, [dispatch, fetchRandomWords, setFocus, resetCounts]);

    const handleTimeSelect = useCallback((time: number) => {
        setSelectedTime(time);
        setTimeLeft(time);
        setIsTimeManuallySelected(true);
    }, []);

    const handleBlur = useCallback(() => {
        setShouldFocus(false);
    }, []);

    useEffect(() => {
        if (currentText) {
            setFocus();
        }
    }, [currentText, setFocus]);

    useEffect(() => {
        if (shouldFocus) {
            setTimeout(() => setShouldFocus(false), 100);
        }
    }, [shouldFocus]);

    useEffect(() => {
        setFocus();
    }, [setFocus]);

    useEffect(() => {
        fetchRandomWords();
    }, [fetchRandomWords]);

    useEffect(() => {
        if (startTime && timeLeft !== null) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime === null || prevTime <= 0) {
                        clearInterval(timer);
                        setIsFinished(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [startTime, timeLeft]);

    return (
        <div className={styles.textContainer}>
            <FocusOverlay isFocused={!shouldFocus} onFocus={setFocus} />
            {!isFinished && (
                <>
                    <TimeSelector onTimeSelect={handleTimeSelect} selectedTime={selectedTime} />
                    <GameArea
                        ref={gameAreaRef}
                        currentText={currentText}
                        currentIndex={currentIndex}
                        typedChars={typedChars}
                        setTypedChars={setTypedChars}
                        extraChars={extraChars}
                        setExtraChars={setExtraChars}
                        isFinished={isFinished}
                        setIsFinished={setIsFinished}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        onBlur={handleBlur}
                        shouldFocus={shouldFocus}
                        selectedTime={selectedTime}
                        setTimeLeft={setTimeLeft}
                        isTimeManuallySelected={isTimeManuallySelected}
                        addChar={addChar}
                        addError={addError}
                    />
                    <div>{timeLeft !== null ? `Time left: ${timeLeft}s` : ''}</div>
                </>
            )}
            {isFinished && (
                <ResultScreen
                    wpm={wpm}
                    errors={errors}
                    onRestart={startNewGame}
                />
            )}
        </div>
    );
};

export default CurrentText;