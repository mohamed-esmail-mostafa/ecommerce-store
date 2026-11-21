import React, { useEffect, useRef, useState } from 'react';
import {
    AlignCenter,
    AlignLeft,
    AlignRight,
    Bold,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Quote,
    Redo,
    RemoveFormatting,
    Strikethrough,
    Underline,
    Undo,
} from 'lucide-react';
import { Button } from './button';
import { Label } from './label';
import { cn } from '@/lib/utils';
import useImports from '@/hooks/use-imports';

interface RichTextEditorProps {
    id?: string;
    label?: string;
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
}

export default function RichTextEditor({
    id = 'rich-text-editor',
    label,
    value = '',
    onChange,
    placeholder = 'Write long description with rich formatting...',
    error,
    className,
}: RichTextEditorProps) {
    const { t } = useImports();
    const editorRef = useRef<HTMLDivElement>(null);
    const [isHtmlMode, setIsHtmlMode] = useState(false);
    const [rawHtml, setRawHtml] = useState(value || '');

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value && !isHtmlMode) {
            editorRef.current.innerHTML = value || '';
        }
        setRawHtml(value || '');
    }, [value, isHtmlMode]);

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            setRawHtml(html);
            onChange(html);
        }
    };

    const handleRawHtmlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        setRawHtml(val);
        onChange(val);
    };

    const execCommand = (command: string, arg: string | undefined = undefined) => {
        if (isHtmlMode) return;
        document.execCommand(command, false, arg);
        editorRef.current?.focus();
        handleInput();
    };

    const handleAddLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    // Calculate word count
    const textContent = rawHtml.replace(/<[^>]+>/g, ' ').trim();
    const wordCount = textContent ? textContent.split(/\s+/).length : 0;
    const charCount = textContent.length;

    return (
        <div className={cn('space-y-1.5', className)}>
            {label && (
                <div className="flex items-center justify-between">
                    <Label htmlFor={id} className="text-xs font-semibold">
                        {label}
                    </Label>
                    <span className="text-[11px] text-muted-foreground">
                        {wordCount} words &bull; {charCount} chars
                    </span>
                </div>
            )}

            <div
                className={cn(
                    'rounded-xl border border-input bg-card shadow-xs transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/20 overflow-hidden',
                    error && 'border-destructive'
                )}
            >
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 border-b border-border/60 bg-muted/30 p-1.5">
                    {/* Headings */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Heading 1"
                        onClick={() => execCommand('formatBlock', '<h1>')}
                    >
                        <Heading1 className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Heading 2"
                        onClick={() => execCommand('formatBlock', '<h2>')}
                    >
                        <Heading2 className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Heading 3"
                        onClick={() => execCommand('formatBlock', '<h3>')}
                    >
                        <Heading3 className="size-3.5" />
                    </Button>

                    <span className="h-4 w-px bg-border mx-1" />

                    {/* Inline Styles */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 font-bold"
                        title="Bold"
                        onClick={() => execCommand('bold')}
                    >
                        <Bold className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 italic"
                        title="Italic"
                        onClick={() => execCommand('italic')}
                    >
                        <Italic className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7 underline"
                        title="Underline"
                        onClick={() => execCommand('underline')}
                    >
                        <Underline className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Strikethrough"
                        onClick={() => execCommand('strikeThrough')}
                    >
                        <Strikethrough className="size-3.5" />
                    </Button>

                    <span className="h-4 w-px bg-border mx-1" />

                    {/* Lists & Quotes */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Bullet List"
                        onClick={() => execCommand('insertUnorderedList')}
                    >
                        <List className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Numbered List"
                        onClick={() => execCommand('insertOrderedList')}
                    >
                        <ListOrdered className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Quote"
                        onClick={() => execCommand('formatBlock', '<blockquote>')}
                    >
                        <Quote className="size-3.5" />
                    </Button>

                    <span className="h-4 w-px bg-border mx-1" />

                    {/* Alignment */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Align Left"
                        onClick={() => execCommand('justifyLeft')}
                    >
                        <AlignLeft className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Align Center"
                        onClick={() => execCommand('justifyCenter')}
                    >
                        <AlignCenter className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Align Right"
                        onClick={() => execCommand('justifyRight')}
                    >
                        <AlignRight className="size-3.5" />
                    </Button>

                    <span className="h-4 w-px bg-border mx-1" />

                    {/* Link & Code */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Insert Link"
                        onClick={handleAddLink}
                    >
                        <LinkIcon className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Clear Formatting"
                        onClick={() => execCommand('removeFormat')}
                    >
                        <RemoveFormatting className="size-3.5" />
                    </Button>

                    <span className="h-4 w-px bg-border mx-1" />

                    {/* Undo / Redo */}
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Undo"
                        onClick={() => execCommand('undo')}
                    >
                        <Undo className="size-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        title="Redo"
                        onClick={() => execCommand('redo')}
                    >
                        <Redo className="size-3.5" />
                    </Button>

                    {/* Toggle Raw HTML View */}
                    <Button
                        type="button"
                        variant={isHtmlMode ? 'default' : 'ghost'}
                        size="sm"
                        className="h-7 text-xs ml-auto px-2 gap-1"
                        onClick={() => setIsHtmlMode(!isHtmlMode)}
                    >
                        <Code className="size-3" />
                        <span>{isHtmlMode ? 'WYSIWYG' : 'HTML'}</span>
                    </Button>
                </div>

                {/* Editor Content Area */}
                {isHtmlMode ? (
                    <textarea
                        value={rawHtml}
                        onChange={handleRawHtmlChange}
                        rows={8}
                        className="w-full p-4 font-mono text-xs bg-muted/10 outline-none resize-y"
                        placeholder="Raw HTML code..."
                    />
                ) : (
                    <div
                        ref={editorRef}
                        contentEditable
                        onInput={handleInput}
                        className="min-h-[180px] max-h-[360px] overflow-y-auto p-4 text-sm leading-relaxed outline-none focus:outline-hidden prose prose-sm dark:prose-invert max-w-none"
                        data-placeholder={placeholder}
                        dangerouslySetInnerHTML={{ __html: value || '' }}
                    />
                )}
            </div>

            {error && <p className="text-xs text-destructive font-medium">{error}</p>}
        </div>
    );
}
