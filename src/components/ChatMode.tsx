import React, { useRef, useEffect } from 'react';
import { DumpLoader } from './DumpLoader';
import { StreamControls } from './StreamControls';
import { VegaPreview } from './VegaPreview';
import { StreamStatus } from '../lib/useStreamPlayer';
import { StreamEvent } from '../lib/parser';
import { Bot, User } from 'lucide-react';
import { Card } from './ui/card';

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

    // Auto-scroll logic similar to StreamingOutput
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentText, status]);

    return (
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-140px)] relative">
            {/* Chat Area - Takes available space */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 pb-4">

                {/* User Message (simulated for context) */}
                {hasEvents && (
                    <div className="flex gap-4 justify-end">
                        <div className="bg-slate-200 dark:bg-slate-800 p-4 rounded-2xl rounded-tr-sm max-w-[80%]">
                            <p className="text-sm font-medium">Analyze the loaded data and visualize it.</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        </div>
                    </div>
                )}

                {/* Bot Message - Only show if we have started streaming */}
                {currentText && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0">
                            <Bot className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div className="space-y-4 max-w-[90%] w-full">
                            {/* Text Output Block */}
                            <div className="bg-white dark:bg-slate-800 border p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                <div className="prose dark:prose-invert text-sm whitespace-pre-wrap font-mono">
                                    {currentText}
                                </div>
                                <VegaPreview currentText={currentText} minified={true} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Controls - Sticky at bottom */}
            <div className="shrink-0 bg-slate-50 dark:bg-slate-900 z-10 pt-4 border-t">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <DumpLoader onLoaded={handleLoaded} />
                    </div>
                    <div className="flex-1">
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
