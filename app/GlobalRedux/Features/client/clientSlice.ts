import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type InitialState = {
    client: clientState
}

type clientState = {
    clientName: string,
    spaceId: number,
}

const initialState = {
    client: {
        clientName: 'Crowne Properties Inc.',
        spaceId: 6830538,
    } as clientState
} as InitialState;

export const client = createSlice({
    name: 'client',
    initialState,
    reducers: {
        setClientName: (state, action: PayloadAction<string>) => {
            state.client.clientName = action.payload;
        },
        setSpaceId: (state, action: PayloadAction<number>) => {
            state.client.spaceId = action.payload;
        },
    },
});



export const { setClientName, setSpaceId } = client.actions;

export const selectClientName = (state: any) => state.client.clientName;
export const selectSpaceId = (state: any) => state.client.spaceId;

console.log()

export default client.reducer;