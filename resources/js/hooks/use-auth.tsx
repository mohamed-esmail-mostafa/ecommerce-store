import { Auth } from '@/types';
import { usePage } from '@inertiajs/react';
import React from 'react'

export default function useAuth() {
    const { auth } = usePage<{ auth?: Auth }>().props;
    return {
        auth
    }
}
