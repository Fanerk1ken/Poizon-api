import React from "react";

interface GameControlsProps {
    onRestart: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ onRestart }) => {
    return (
        <div>
            <button onClick={onRestart}>Начать заново</button>
        </div>
    );
};

export default GameControls;