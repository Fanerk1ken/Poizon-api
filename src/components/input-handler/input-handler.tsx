import React, { forwardRef, useImperativeHandle, useCallback, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { addErrors, setCurrentIndex } from "../../redux/typingSlice";
import { InputHandlerHandle } from "../../types/input-handler";

interface InputHandlerProps {
    isFinished: boolean;
    setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
    setStartTime: (time: number) => void;
    startTime: number | null;
    onBlur: () => void;
    shouldFocus: boolean;
    typedChars: (string | undefined)[];
    setTypedChars: React.Dispatch<React.SetStateAction<(string | undefined)[]>>;
    extraChars: string[];
    setExtraChars: React.Dispatch<React.SetStateAction<string[]>>;
}

const InputHandler = forwardRef<InputHandlerHandle, InputHandlerProps>(({
                                                                            isFinished,
                                                                            setIsFinished,
                                                                            setStartTime,
                                                                            startTime,
                                                                            onBlur,
                                                                            shouldFocus,
                                                                            typedChars,
                                                                            setTypedChars,
                                                                            extraChars,
                                                                            setExtraChars
                                                                        }, ref) => {
    const dispatch = useDispatch();
    const { currentText, currentIndex } = useSelector((state: RootState) => state.typing);
    const inputRef = useRef<HTMLInputElement>(null);
    const lastSpaceIndexRef = useRef<number>(-1);

    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current?.focus();
        },
        resetLastSpaceIndex: () => {
            lastSpaceIndexRef.current = -1;
        }
    }));

    useEffect(() => {
        if (shouldFocus) {
            inputRef.current?.focus();
        }
    }, [shouldFocus]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (isFinished) return;

        if (!startTime) {
            setStartTime(Date.now());
        }

        // Список клавиш, которые не должны считаться ошибками
        const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];

        if (ignoredKeys.includes(event.key)) {
            return;
        }

        if (event.key === 'Backspace') {
            if (currentIndex > 0) {
                const prevIndex = currentIndex - 1;
                const newTypedChars = [...typedChars];

                if (currentText[prevIndex] === ' ' && typedChars[prevIndex] === undefined) {
                    let lastTypedIndex = -1;
                    for (let i = prevIndex - 1; i >= 0; i--) {
                        if (newTypedChars[i] !== undefined) {
                            lastTypedIndex = i;
                            break;
                        }
                    }
                    if (lastTypedIndex !== -1) {
                        const skippedChars = prevIndex - lastTypedIndex - 1;
                        dispatch(addErrors(-skippedChars));
                        dispatch(setCurrentIndex(lastTypedIndex + 1));
                    }
                } else {
                    if (newTypedChars[prevIndex] !== undefined) {
                        if (newTypedChars[prevIndex] !== currentText[prevIndex]) {
                            dispatch(addErrors(-1));
                        }
                        newTypedChars[prevIndex] = undefined;
                    }
                    dispatch(setCurrentIndex(prevIndex));
                }

                setTypedChars(newTypedChars);

                if (prevIndex > 0 && currentText[prevIndex - 1] === ' ') {
                    lastSpaceIndexRef.current = prevIndex - 1;
                } else {
                    const lastSpaceIndex = currentText.lastIndexOf(' ', prevIndex - 1);
                    lastSpaceIndexRef.current = lastSpaceIndex === -1 ? -1 : lastSpaceIndex;
                }
            }
        } else if (event.key === ' ') {
            const lastSpaceIndex = currentText.lastIndexOf(' ', currentIndex - 1);
            const hasTypedInCurrentWord = typedChars.slice(lastSpaceIndex + 1, currentIndex).some(char => char !== undefined);

            if (hasTypedInCurrentWord) {
                const nextSpaceIndex = currentText.indexOf(' ', currentIndex);
                const nextWordStart = nextSpaceIndex === -1 ? currentText.length : nextSpaceIndex + 1;

                const skippedChars = nextWordStart - currentIndex - 1;
                dispatch(addErrors(skippedChars));

                const newTypedChars = [...typedChars];
                for (let i = currentIndex; i < nextWordStart; i++) {
                    newTypedChars[i] = undefined;
                }
                setTypedChars(newTypedChars);
                lastSpaceIndexRef.current = nextWordStart - 1;
                dispatch(setCurrentIndex(nextWordStart));
            }
        } else if (currentIndex < currentText.length) {
            const currentChar = currentText[currentIndex];
            const newTypedChars = [...typedChars];
            newTypedChars[currentIndex] = event.key;
            setTypedChars(newTypedChars);

            if (event.key !== currentChar) {
                dispatch(addErrors(1));
            }
            dispatch(setCurrentIndex(currentIndex + 1));
        } else {
            setExtraChars([...extraChars, event.key]);
            dispatch(addErrors(1));
        }

        if (currentIndex + 1 >= currentText.length) {
            setIsFinished(true);
        }
    }, [isFinished, startTime, setStartTime, currentIndex, currentText, dispatch, setIsFinished, typedChars, setTypedChars, extraChars, setExtraChars]);

    return (
        <input
            ref={inputRef}
            type="text"
            onKeyDown={handleKeyDown}
            onBlur={onBlur}
            style={{ opacity: 0, position: 'absolute' }}
        />
    );
});

export default InputHandler;