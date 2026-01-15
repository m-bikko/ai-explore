import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { Download, FileText, Copy, Check } from 'lucide-react';

import { VegaPreview } from './VegaPreview';
import { ThinkingBlock } from './ThinkingBlock';
import { Button } from './ui/button';
import { extractThinkingProcess } from '../lib/parser';
import { useMessageActions } from '../hooks/useMessageActions';

interface MessageContentProps {
    text: string;
    isStreaming?: boolean;
}

export function MessageContent({ text, isStreaming = false }: MessageContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const { hasThought, thought, content, isClosed } = extractThinkingProcess(text);
    const { copied, handleCopy, handleDownloadMD, handleDownloadPDF } = useMessageActions(text);

    return (
        <div className="space-y-4 max-w-[90%] w-full">
            {/* Thought Block */}
            {hasThought && (
                <ThinkingBlock thought={thought} isClosed={isClosed} />
            )}

            {/* Main Content Block */}
            <div
                ref={contentRef}
                className="bg-white dark:bg-slate-800 border p-4 rounded-2xl rounded-tl-sm shadow-sm overflow-hidden relative group min-h-[60px]"
            >
                <div className="prose dark:prose-invert text-sm max-w-none break-words">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {content}
                    </ReactMarkdown>
                </div>

                <VegaPreview currentText={content} minified={true} />

                {/* Footer Actions */}
                {content && (
                    <div className="flex justify-end gap-1 mt-4 pt-2 border-t dark:border-slate-800/50 print:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => handleDownloadPDF(contentRef.current)}
                            title="Скачать PDF"
                        >
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            PDF
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={handleDownloadMD}
                            title="Скачать Markdown"
                        >
                            <Download className="h-3.5 w-3.5 mr-1" />
                            MD
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={handleCopy}
                            title="Скопировать"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
                                    <span className="text-green-500">Скопировано</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="h-3.5 w-3.5 mr-1" />
                                    Копировать
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
