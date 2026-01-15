import React, { useState } from 'react';
import { Brain, ChevronDown, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

interface ThinkingBlockProps {
    thought: string;
    isClosed: boolean;
}

export function ThinkingBlock({ thought, isClosed }: ThinkingBlockProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="mb-4 border rounded-lg bg-gray-50 dark:bg-slate-900 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 p-2 bg-gray-100 dark:bg-slate-800 text-xs font-medium text-muted-foreground hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
                {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <Brain className="h-3 w-3" />
                <span>Процесс мышления</span>
                {!isClosed && <span className="animate-pulse ml-2 text-blue-500">●</span>}
            </button>

            {isOpen && (
                <div className="p-3 text-xs text-muted-foreground font-mono leading-relaxed border-t dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/30">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{thought}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}
