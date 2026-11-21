import React, { useRef } from 'react';
import { Button } from './button';
import useImports from '@/hooks/use-imports';
import { ImageIcon, Trash2Icon, Upload } from 'lucide-react';

interface ImagesPickerProps {
    name: string;
    images: File[];
    setFieldValue: (field: string, value: any) => void;
    multiple?: boolean;
    error?: string;
}

export default function ImagesPicker({
    name,
    images = [],
    setFieldValue,
    multiple = true,
    error,
}: ImagesPickerProps) {
    const { t } = useImports();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setFieldValue(name, multiple ? [...images, ...files] : files.slice(0, 1));
        }
        e.target.value = '';
    };

    const removeImage = (index: number) => {
        setFieldValue(
            name,
            images.filter((_, i) => i !== index)
        );
    };

    return (
        <div className="space-y-3">
            <input
                ref={inputRef}
                name="upload"
                type="file"
                onChange={handleChange}
                accept="image/*"
                multiple={multiple}
                className="hidden"
            />

            {/* Drop / Click Zone */}
            <div
                onClick={() => inputRef.current?.click()}
                className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-2xl flex flex-col items-center justify-center py-8 px-4 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40"
            >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <ImageIcon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                    {t('common.upload-image')}
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                    {t('common.file-size-limit')}
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3 gap-1.5 pointer-events-none"
                >
                    <Upload className="w-3.5 h-3.5" />
                    {t('common.choose-file')}
                </Button>
            </div>

            {error && <p className="text-xs text-destructive font-medium">{error}</p>}

            {/* Thumbnails Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {images.map((file, index) => (
                        <div
                            key={`${file.name}-${index}`}
                            className="border border-border/70 rounded-xl relative overflow-hidden aspect-square group shadow-xs bg-muted/40"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="size-8 rounded-full"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(index);
                                    }}
                                    title={t('common.delete')}
                                >
                                    <Trash2Icon className="size-4" />
                                </Button>
                            </div>
                            <span className="absolute bottom-1 left-1.5 text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded font-mono truncate max-w-[85%]">
                                {file.name}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
