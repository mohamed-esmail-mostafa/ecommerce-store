import { usePage } from '@inertiajs/react'
import React from 'react'

export default function useUserCart() {
    const { cartCount } = usePage().props
    return {
        cartCount
    }
}
