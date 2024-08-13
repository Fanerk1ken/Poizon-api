import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { resetState, setCurrentText } from "../../redux/typingSlice";
import GameArea from "../game-area";
import ResultScreen from "../result-screen";
import TimeSelector from "../time-selector";
import styles from "./current-text.module.scss";
import axios from 'axios';
import { InputHandlerHandle } from "../../types/input-handler";
import { useWPM } from '../../hooks/useWPM';
import FocusOverlay from "../focus-overlay";
import { IoRefreshOutline as RefreshIcon} from "react-icons/io5";
import Footer from "../footer";

const CurrentText: React.FC = () => {
    const dispatch = useDispatch();
    const { currentText, currentIndex, errors } = useSelector((state: RootState) => state.typing);

    const [selectedTime, setSelectedTime] = useState<number>(15);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [typedChars, setTypedChars] = useState<(string | undefined)[]>([]);
    const [extraChars, setExtraChars] = useState<string[]>([]);
    const [isTimeManuallySelected, setIsTimeManuallySelected] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState(true);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [isFinished, setIsFinished] = useState<boolean>(false);

    const { wpm, addChar, addError, resetCounts } = useWPM(startTime, isFinished);

    const gameAreaRef = useRef<InputHandlerHandle>(null);

    // Fetch случайных слов для теста на набор текста
    const fetchRandomWords = useCallback(async () => {
        try {
            const response = await axios.get('https://fish-text.ru/get', {
                params: {
                    type: 'paragraph',
                    number: 3,
                    format: 'json'
                }
            });
            if (response.data && response.data.status === 'success' && response.data.text) {
                const formattedText = response.data.text.toLowerCase().replace(/[.,]/g, "").trim();
                dispatch(setCurrentText(formattedText));
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Failed to fetch random words:', error);
        }
    }, [dispatch]);

    // Инициализация игры
    useEffect(() => {
        fetchRandomWords();
    }, [fetchRandomWords]);

    // Обработка перезапуска игры
    const startNewGame = useCallback(() => {
        dispatch(resetState());
        setIsFinished(false);
        setStartTime(null);
        setTimeLeft(null);
        setTypedChars([]);
        setExtraChars([]);
        setIsTimeManuallySelected(false);
        resetCounts();
        fetchRandomWords();
        if (gameAreaRef.current) {
            gameAreaRef.current.resetLastSpaceIndex();
        }
    }, [dispatch, fetchRandomWords, resetCounts]);

    // Обработка выбора времени
    const handleTimeSelect = useCallback((time: number) => {
        setSelectedTime(time);
        setTimeLeft(time);
        setIsTimeManuallySelected(true);
    }, []);

    // Обработка фокуса
    const handleFocus = useCallback(() => {
        setIsFocused(true);
        if (gameAreaRef.current) {
            gameAreaRef.current.focus();
        }
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
    }, []);

    // Глобальный слушатель ключевых событий для фокуса
    useEffect(() => {
        const handleKeyDown = () => {
            if (!isFocused) {
                handleFocus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFocused, handleFocus]);

    // Таймер effect
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
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Typing Speed by Nikandrov Egor</h1>
                <TimeSelector onTimeSelect={handleTimeSelect} selectedTime={selectedTime}/>
            </div>
            <div className={styles.contentArea}>
                {!isFinished ? (
                    <div className={styles.gameAreaWrapper}>
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
                            shouldFocus={isFocused}
                            selectedTime={selectedTime}
                            setTimeLeft={setTimeLeft}
                            isTimeManuallySelected={isTimeManuallySelected}
                            addChar={addChar}
                            addError={addError}
                        />
                        <div className={styles.timer}>{timeLeft !== null ? `${timeLeft}` : ''}</div>

                        <FocusOverlay isFocused={isFocused} onFocus={handleFocus}/>
                    </div>
                ) : (
                    <ResultScreen
                        wpm={wpm}
                        errors={errors}
                        onRestart={startNewGame}
                    />
                )}
            </div>
            <button
                className={styles.restartButton}
                onClick={startNewGame}
            >
                <RefreshIcon />
            </button>
            <Footer />
        </div>
    );
};

export default CurrentText;