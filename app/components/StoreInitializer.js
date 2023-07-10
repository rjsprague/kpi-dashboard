"use client"

import { useRef } from 'react'
import { useClientStore } from '../(store)/store'

function StoreInitializer(clientName, clientSpaceId) {
    const initialized = useRef(false)

    if (!initialized.current) {
        useClientStore.setState(clientName, clientSpaceId)
        initialized.current = true
    }
    return null
}

export default StoreInitializer