import React, { forwardRef} from "react";
import TextDisplay from "../text-display";
import InputHandler from "../input-handler";
import { InputHandlerHandle } from "../../types/input-handler";
import styles from "./game-area.module.scss";

interface GameAreaProps {
    currentText: string;
    currentIndex: number;
    typedChars: (string | undefined)[];
    setTypedChars: React.Dispatch<React.SetStateAction<(string | undefined)[]>>;
    extraChars: string[];
    setExtraChars: React.Dispatch<React.SetStateAction<string[]>>;
    isFinished: boolean;
    setIsFinished: React.Dispatch<React.SetStateAction<boolean>>;
    startTime: number | null;
    setStartTime: (time: number) => void;
    onBlur: () => void;
    shouldFocus: boolean;
}

const GameArea = forwardRef<InputHandlerHandle, GameAreaProps>(({
                                                                    currentText,
                                                                    currentIndex,
                                                                    typedChars,
                                                                    setTypedChars,
                                                                    extraChars,
                                                                    setExtraChars,
                                                                    isFinished,
                                                                    setIsFinished,
                                                                    startTime,
                                                                    setStartTime,
                                                                    onBlur,
                                                                    shouldFocus
                                                                }, ref) => {
    return (
        <div className={styles.gameArea}>
            <div className={styles.textDisplay}>
                <TextDisplay
                    currentText={currentText}
                    currentIndex={currentIndex}
                    typedChars={typedChars}
                    // extraChars={extraChars}
                />
            </div>
            <InputHandler
                ref={ref}
                isFinished={isFinished}
                setIsFinished={setIsFinished}
                setStartTime={setStartTime}
                startTime={startTime}
                onBlur={onBlur}
                shouldFocus={shouldFocus}
                typedChars={typedChars}
                setTypedChars={setTypedChars}
                extraChars={extraChars}
                setExtraChars={setExtraChars}
            />
        </div>
    );
});

export default GameArea;