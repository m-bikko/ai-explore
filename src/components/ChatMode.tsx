import React, { useRef, useEffect } from 'react';
import { DumpLoader } from './DumpLoader';
import { StreamControls } from './StreamControls';
import { StreamStatus } from '../lib/useStreamPlayer';
import { StreamEvent, extractThinkingProcess } from '../lib/parser';
import { Bot, User } from 'lucide-react';
import { MessageContent } from './MessageContent';
import 'highlight.js/styles/github-dark.css';

interface ChatModeProps {
    status: StreamStatus;
    currentText: string;
    play: () => void;
    stop: () => void;
    speedMultiplier: number;
    setSpeedMultiplier: (speed: number) => void;
    hasEvents: boolean;
    handleLoaded: (events: StreamEvent[]) => void;
}

export function ChatMode({
    status,
    currentText,
    play,
    stop,
    speedMultiplier,
    setSpeedMultiplier,
    hasEvents,
    handleLoaded
}: ChatModeProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const { hasThought } = extractThinkingProcess(currentText);

    // Auto-scroll logic similar to StreamingOutput
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentText, status, hasThought]); // Depend on structure changes as well


    // Derived state for when to show typing indicator
    // Show if we are streaming OR if we have events but have not finished (though status 'streaming' covers mostly)
    const showTyping = status === 'streaming';

    // Only show bot if there is *some* text (thought or content) OR we are strictly streaming thinking
    const showBot = currentText || showTyping;

    return (
        <div className="mx-auto flex flex-col h-[calc(100vh-140px)] relative">
            {/* Chat Area - Takes available space */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-4">

                {/* User Message (simulated for context) */}
                {hasEvents && (
                    <div className="flex gap-4 justify-end">
                        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-2xl rounded-tr-sm max-w-[80%]">
                            <p className="text-sm font-medium">Проанализируйте загруженные данные и визуализируйте их.</p>
                        </div>
                        <div className="hidden sm:flex w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </div>
                    </div>
                )}

                {/* Bot Message - Only show if we have started streaming */}
                {showBot && (
                    <div className="flex gap-4">
                        <div className="hidden sm:flex w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center shrink-0">
                            <Bot className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <MessageContent text={currentText} isStreaming={status === 'streaming'} />
                    </div>
                )}

                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Controls - Sticky at bottom */}
            <div className="shrink-0 bg-slate-50 dark:bg-slate-900 z-10 pt-4 border-t">
                <div className="flex flex-col gap-3">
                    <div className="w-full">
                        <DumpLoader onLoaded={handleLoaded} />
                    </div>
                    <div className="w-full">
                        <StreamControls
                            onPlay={play}
                            onStop={stop}
                            status={status}
                            speed={speedMultiplier}
                            setSpeed={setSpeedMultiplier}
                            disabled={!hasEvents}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
