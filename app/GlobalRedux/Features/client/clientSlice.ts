import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';


type ClientState = {
    clientName: string,
    spaceId: number,
}

const initialState: ClientState = {
    clientName: 'Closers',
    spaceId: 8108305,
};

export const client = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setClientName: (state, action: PayloadAction<string>) => {
            state.clientName = action.payload;
        },
        setSpaceId: (state, action: PayloadAction<number>) => {
            state.spaceId = action.payload;
        },
    },
});

export const { setClientName, setSpaceId } = client.actions;

export const selectClientName = (state: RootState) => state.client.clientName;
export const selectSpaceId = (state: RootState) => state.client.spaceId;

export default client.reducer;