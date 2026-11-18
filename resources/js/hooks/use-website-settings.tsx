
import { WebsiteSetting } from '@/types/website-setting';
import { usePage } from '@inertiajs/react';
import React from 'react'

export default function useWebsiteSettings() {
   const { settings } = usePage<{ settings?: WebsiteSetting }>().props;
    return {
       settings 
    }
}
