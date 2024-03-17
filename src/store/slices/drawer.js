import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    open : false,
}

const drawer = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        changeDrawerState(state) {
            state.open = !state.open;
        },
        
    }
});

export default drawer.reducer;
export const { changeDrawerState } = drawer.actions;
