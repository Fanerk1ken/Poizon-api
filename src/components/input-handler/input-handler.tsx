import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { addErrors, incrementCurrentIndex, setCurrentIndex } from "../../redux/typingSlice";

export interface InputHandlerHandle {
    focus: () => void;
}

interface InputHandlerProps {
    isFinished: boolean;
    setStartTime: (time: number) => void;
    setTypedChars: (chars: (string | undefined)[]) => void;
    setExtraChars: (chars: string[]) => void;
    setIsFinished: (isFinished: boolean) => void;
    setInputHistory: (history: number[]) => void;
    inputHistory: number[];
    typedChars: (string | undefined)[];
    extraChars: string[];
    startTime: number | null;
    calculateWpm: () => void;
}

const InputHandler = forwardRef<InputHandlerHandle, InputHandlerProps>(({
                                                                            isFinished,
                                                                            setStartTime,
                                                                            setTypedChars,
                                                                            setExtraChars,
                                                                            setIsFinished,
                                                                            setInputHistory,
                                                                            inputHistory,
                                                                            typedChars,
                                                                            extraChars,
                                                                            startTime,
                                                                            calculateWpm
                                                                        }, ref) => {
    const dispatch = useDispatch();
    const { currentText, currentIndex } = useSelector((state: RootState) => state.typing);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => {
            if (containerRef.current) {
                containerRef.current.focus();
            }
        }
    }));

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (isFinished) return;

        if (event.key === 'Shift' || event.key === 'Alt' || event.key === 'Control' ||
            event.key === 'CapsLock' || event.key === 'Tab' || event.key.startsWith('Arrow')) {
            return;
        }

        if (!startTime) {
            setStartTime(Date.now());
        }

        if (event.key === 'Backspace') {
            if (inputHistory.length > 1) {
                const newInputHistory = [...inputHistory];
                const lastInputPosition = newInputHistory.pop() as number;
                const previousInputPosition = newInputHistory.at(-1) as number;

                const newTypedChars = [...typedChars];
                for (let i = previousInputPosition; i < lastInputPosition; i++) {
                    if (newTypedChars[i] !== currentText[i]) {
                        dispatch(addErrors(-1));
                    }
                    newTypedChars[i] = undefined;
                }

                setTypedChars(newTypedChars);
                setInputHistory(newInputHistory);
                dispatch(setCurrentIndex(previousInputPosition));
            }
        } else if (event.key === ' ') {
            const currentWordStart = currentText.lastIndexOf(' ', currentIndex - 1) + 1;
            const hasTypedInCurrentWord = typedChars.slice(currentWordStart, currentIndex).some(char => char !== undefined);

            if (hasTypedInCurrentWord) {
                const nextSpaceIndex = currentText.indexOf(' ', currentIndex);
                const nextWordStart = nextSpaceIndex === -1 ? currentText.length : nextSpaceIndex + 1;

                const skippedChars = nextSpaceIndex - currentIndex;
                dispatch(addErrors(skippedChars));

                const newTypedChars = [...typedChars];
                for (let i = currentIndex; i < nextWordStart; i++) {
                    newTypedChars[i] = undefined;
                }
                setTypedChars(newTypedChars);
                dispatch(setCurrentIndex(nextWordStart));

                setInputHistory([...inputHistory, nextWordStart]);
            }
        } else if (currentIndex < currentText.length) {
            const currentChar = currentText[currentIndex];
            const newTypedChars = [...typedChars];
            newTypedChars[currentIndex] = event.key;
            setTypedChars(newTypedChars);

            if (event.key !== currentChar) {
                dispatch(addErrors(1));
            }
            dispatch(incrementCurrentIndex(1));

            setInputHistory([...inputHistory, currentIndex + 1]);
        } else {
            setExtraChars([...extraChars, event.key]);
            dispatch(addErrors(1));
        }

        if (currentIndex + 1 >= currentText.length) {
            setIsFinished(true);
            calculateWpm();
        }
    };

    return (
        <div
            ref={containerRef}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            style={{outline: 'none'}}
        />
    );
});

export default InputHandler;