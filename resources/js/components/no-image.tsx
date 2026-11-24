
import { ImageOff } from 'lucide-react'
import React from 'react'

interface NoImageProps {
    className?: string
    iconSize?: number
}

export default function NoImage({
    className = '',
    iconSize = 36,
}: NoImageProps) {
    return (
        <div
            className={`flex w-full h-44 items-center justify-center overflow-hidden rounded-md bg-muted ${className}`}
        >
            <div className="flex items-center justify-center rounded-full bg-background/70 p-4">
                <ImageOff
                    size={iconSize}
                    strokeWidth={1.4}
                    className="text-muted-foreground"
                />
            </div>
        </div>
    )
}
