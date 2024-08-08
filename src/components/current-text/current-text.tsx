import React from "react";
import {useDispatch} from "react-redux";
import {useSelector} from "react-redux";
import {RootState} from "../../app/store.ts";
import {useState} from "react";
import {useEffect} from "react";
import style from "./current-text.module.scss";
import {incrementCurrentIndex} from "../../redux/typingSlice.ts";
import {incrementErrors} from "../../redux/typingSlice.ts";

const CurrentText: React.FC = () => {
    const dispatch = useDispatch();
    const {currentText, currentIndex, errors, wpm} = useSelector((state: RootState) => state.typing);

    const [text, setText] = useState<string>('')
    const [currentChar, setCurrentChar] = useState<number>(0)

    const textContainerRef = React.useRef<HTMLDivElement>(null);

    //функция обработки нажатия клавиш
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === text[currentChar]) {
            console.log('correct')
            setCurrentChar(currentChar + 1)
            dispatch(incrementCurrentIndex())
        } else {
            console.log('incorrect')
            dispatch(incrementErrors())
        }
    }


    useEffect(() => {
        if (textContainerRef.current) {
            textContainerRef.current.focus()
        }
    }, []);

    useEffect(() => {
        if (currentText && currentIndex < currentText.length) {
            setText(currentText[currentIndex])
        }
    }, [currentText, currentIndex]);

    return (
        <>

            <div className={style.textContainer} onKeyDown={handleKeyDown} ref={textContainerRef} tabIndex={0}>
                <div className={style.textStyle}>
                    {text.split('').map((char, index) => (
                        <span
                            key={index}
                            className={`${index < currentChar ? style.correct : ''} ${index === currentChar ? style.current : ''} ${
                                index >= currentChar ? style.incorrect : '' 
                            }`}
                        >
                            {char}
                        </span>
                    ))}
                </div>
                <div>
                    <p>Errors: {errors}</p>
                    <p>WPM: {wpm}</p>
                </div>
            </div>
        </>
    );
};

export default CurrentText;