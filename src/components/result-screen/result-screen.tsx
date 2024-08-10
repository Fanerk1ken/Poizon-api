import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const ResultScreen: React.FC = () => {
    const { errors, wpm } = useSelector((state: RootState) => state.typing);

    return (
        <div>
            <h2>Поздравляем! Вы закончили текст.</h2>
            <p>Финальные ошибки: {errors}</p>
            <p>Финальный WPM: {wpm}</p>
        </div>
    );
};

export default ResultScreen;