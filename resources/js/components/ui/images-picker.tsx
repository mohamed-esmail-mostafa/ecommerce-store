import { useFormikContext } from 'formik'
import React, { useRef } from 'react'
import { Button } from './button'
import useImports from '@/hooks/use-imports';
import { ImageIcon, Trash2Icon, Upload } from 'lucide-react';

interface FormValues {
    images: File[]
}

interface ImagesPickerProps {
    name: string;
    images: File[];
    setFieldValue: (
        field: string,
        value: any
    ) => void;
    multiple?: boolean
}

export default function ImagesPicker({ name, images, setFieldValue, multiple = false }: ImagesPickerProps) {
    const { t } = useImports()
    const inputRef = useRef<HTMLInputElement>(null)


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFieldValue(name, multiple ? [...images, ...files] : files.slice(0, 1));

        // allow selecting the same file

        e.target.value = ""
    };

    const removeImage = (index: number) => {
        setFieldValue(name, images.filter((_, i) => i !== index))
    }
    return (
        <div>
           <input
             name="upload"
                type="file"
                onChange={handleChange}
                accept='image/*'
                multiple={multiple}
            />

            <Button type='button' onClick={()=>inputRef.current?.click()}>Choose Images</Button>




            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-primary" />
                </div>
                <div className="mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">

                        {t('common.upload-image')}
                    </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('common.file-size-limit')}
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4 bg-main hover:bg-second"

                    onClick={() => inputRef.current?.click()}
                >
                    <Upload className="w-4 h-4 mr-2" />
                    {t('common.choose-file')}
                </Button>
            </div>



            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
                {images.map((file, index) => (
                    <div key={`${file.name}-${index}`} className='border rounded-2xl relative overflow-hidden w-44 h-44'>
                        <img src={URL.createObjectURL(file)} alt={file.name}  />
                        <Button className='absolute top-4 right-3' type='button' variant="destructive" size="icon" onClick={() => removeImage(index)}>
                            <Trash2Icon />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
