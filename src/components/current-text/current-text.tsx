import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { resetState, setCurrentText } from "../../redux/typingSlice";
import TextDisplay from "../text-display";
import InputHandler from "../input-handler";
import Statistics from "../statistics";
import GameControls from "../game-controls";
import ResultScreen from "../result-screen";
import TimeSelector from "../time-selector";
import styles from "./current-text.module.scss";
import { InputHandlerHandle } from "../../types/input-handler.ts";
import axios from 'axios';

const CurrentText: React.FC = () => {
    const dispatch = useDispatch();
    const { currentText, currentIndex } = useSelector((state: RootState) => state.typing);

    const [typedChars, setTypedChars] = useState<(string | undefined)[]>([]);
    const [extraChars, setExtraChars] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [inputHistory, setInputHistory] = useState<number[]>([0]);
    const [selectedTime, setSelectedTime] = useState<number>(15);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const inputHandlerRef = useRef<InputHandlerHandle>(null);
    const isInitializedRef = useRef<boolean>(false);
    const fetchingRef = useRef<boolean>(false);

    const formatText = useCallback((text: string): string => {
        return text.toLowerCase().replace(/[.,]/g, "").trim();
    }, []);

    const fetchRandomWords = useCallback(async () => {
        if (isInitializedRef.current || fetchingRef.current) return;

        fetchingRef.current = true;
        try {
            console.log("Fetching random words...");
            const response = await axios.get('https://fish-text.ru/get', {
                params: {
                    type: 'paragraph',
                    number: 3,
                    format: 'json'
                }
            });
            console.log("API response:", response.data);
            if (response.data && response.data.status === 'success' && response.data.text) {
                const formattedText = formatText(response.data.text);
                dispatch(setCurrentText(formattedText));
                isInitializedRef.current = true;
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch random words:', error);
        } finally {
            fetchingRef.current = false;
        }
    }, [dispatch, formatText]);

    const startNewGame = useCallback(() => {
        dispatch(resetState());
        setTypedChars([]);
        setExtraChars([]);
        setStartTime(null);
        setIsFinished(false);
        setInputHistory([0]);
        setTimeLeft(null);
        isInitializedRef.current = false;
        fetchRandomWords();
    }, [dispatch, fetchRandomWords]);

    const handleTimeSelect = useCallback((time: number) => {
        setSelectedTime(time);
        setTimeLeft(time);
        if (inputHandlerRef.current) {
            inputHandlerRef.current.focus();
        }
    }, []);

    const handleFirstKeyPress = useCallback(() => {
        if (!startTime) {
            setStartTime(Date.now());
        }
    }, [startTime]);

    useEffect(() => {
        fetchRandomWords();
    }, [fetchRandomWords]);

    useEffect(() => {
        if (startTime && selectedTime) {
            const timer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTime) / 1000);
                const remaining = selectedTime - elapsed;
                if (remaining <= 0) {
                    clearInterval(timer);
                    setIsFinished(true);
                    setTimeLeft(0);
                } else {
                    setTimeLeft(remaining);
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [startTime, selectedTime]);

    useEffect(() => {
        if (inputHandlerRef.current) {
            inputHandlerRef.current.focus();
        }
    }, [selectedTime]);

    if (!currentText) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.textContainer}>
            <TextDisplay
                currentText={currentText}
                typedChars={typedChars}
                extraChars={extraChars}
                currentIndex={currentIndex}
            />
            <TimeSelector onTimeSelect={handleTimeSelect} selectedTime={selectedTime} />
            {!isFinished && (
                <InputHandler
                    ref={inputHandlerRef}
                    isFinished={isFinished}
                    setStartTime={handleFirstKeyPress}
                    setTypedChars={setTypedChars}
                    setExtraChars={setExtraChars}
                    setIsFinished={setIsFinished}
                    setInputHistory={setInputHistory}
                    inputHistory={inputHistory}
                    typedChars={typedChars}
                    extraChars={extraChars}
                    startTime={startTime}
                    calculateWpm={() => {}}
                />
            )}
            <div>{timeLeft !== null ? `Time left: ${timeLeft}s` : ''}</div>
            <Statistics />
            {isFinished ? (
                <>
                    <ResultScreen />
                    <GameControls onRestart={startNewGame} />
                </>
            ) : (
                <GameControls onRestart={startNewGame} />
            )}
        </div>
    );
};

export default CurrentText;