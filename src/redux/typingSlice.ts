import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TypingState {
    currentText: string[],
    currentIndex: number,
    errors: number,
    wpm: number,
}

const initialState: TypingState = {
    currentText: ['text test text test text test text test'],
    currentIndex: 0,
    errors: 0,
    wpm: 0,
}


const typingSlice = createSlice({
    name: 'typing',
    initialState,
    reducers: {
        incrementCurrentIndex: (state) => {
            state.currentIndex += 1;
        },
        incrementErrors: (state) => {
            state.errors += 1;
        },
        incrementWpm: (state, action: PayloadAction<number>) => {
            state.wpm = action.payload
        },
    },
});

export const { incrementCurrentIndex, incrementErrors, incrementWpm } = typingSlice.actions;
export default typingSlice.reducer;