import { create } from "zustand";

export const useClientStore = create(
    () => ({
        clientName: "Crowne",
        clientSpaceId: 6830538,
    })

)

console.log("useClientStore", useClientStore.getState())
