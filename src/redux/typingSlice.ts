// redux/typingSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypingState {
    currentText: string;
    currentIndex: number;
    errors: number;
    isInitialized: boolean;
}

const initialState: TypingState = {
    currentText: '',
    currentIndex: 0,
    errors: 0,
    isInitialized: false,
};

const typingSlice = createSlice({
    name: 'typing',
    initialState,
    reducers: {
        setCurrentText: (state, action: PayloadAction<string>) => {
            state.currentText = action.payload;
        },
        setCurrentIndex: (state, action: PayloadAction<number>) => {
            state.currentIndex = action.payload;
        },
        addErrors: (state, action: PayloadAction<number>) => {
            state.errors += action.payload;
        },
        resetState: (state) => {
            state.currentIndex = 0;
            state.errors = 0;
        },
    },
});

export const { setCurrentText, setCurrentIndex, addErrors, resetState } = typingSlice.actions;

export default typingSlice.reducer;