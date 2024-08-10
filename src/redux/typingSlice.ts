import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TypingState {
    currentText: string;
    currentIndex: number;
    errors: number;
    wpm: number;
    isInitialized: boolean,
}

const initialState: TypingState = {
    currentText: '',
    currentIndex: 0,
    errors: 0,
    wpm: 0,
    isInitialized: false,
};

const typingSlice = createSlice({
    name: 'typing',
    initialState,
    reducers: {
        setCurrentText: (state, action: PayloadAction<string>) => {
            state.currentText = action.payload;
        },
        incrementCurrentIndex: (state, action: PayloadAction<number>) => {
            state.currentIndex += action.payload;
        },
        addErrors: (state, action: PayloadAction<number>) => {
            state.errors += action.payload;
        },
        updateWpm: (state, action: PayloadAction<number>) => {
            state.wpm = action.payload;
        },
        resetState: (state) => {
            state.currentIndex = 0;
            state.errors = 0;
            state.wpm = 0;
        },
        setCurrentIndex: (state, action: PayloadAction<number>) => {
            state.currentIndex = action.payload;
        },
        initializeState: (state) => {
            state.isInitialized = true;
        },
    },
});

export const { setCurrentText, incrementCurrentIndex, addErrors, updateWpm, resetState , setCurrentIndex, initializeState} = typingSlice.actions;

export default typingSlice.reducer;