import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const Statistics: React.FC = () => {
    const { errors, wpm } = useSelector((state: RootState) => state.typing);

    return (
        <div>
            <p>Errors: {errors}</p>
            <p>WPM888: {wpm}</p>
        </div>
    );
};

export default Statistics;