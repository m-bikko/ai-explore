import React from 'react';
import { DumpLoader } from './DumpLoader';
import { StreamControls } from './StreamControls';
import { StreamingOutput } from './StreamingOutput';
import { VegaPreview } from './VegaPreview';
import { StreamStatus } from '../lib/useStreamPlayer';
import { StreamEvent } from '../lib/parser';

interface DashboardModeProps {
    status: StreamStatus;
    currentText: string;
    play: () => void;
    stop: () => void;
    speedMultiplier: number;
    setSpeedMultiplier: (speed: number) => void;
    hasEvents: boolean;
    handleLoaded: (events: StreamEvent[]) => void;
}

export function DashboardMode({
    status,
    currentText,
    play,
    stop,
    speedMultiplier,
    setSpeedMultiplier,
    hasEvents,
    handleLoaded
}: DashboardModeProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-6 flex flex-col w-full order-1 lg:order-none lg:h-[calc(100vh-200px)]">
                {/* Top Controls Area */}
                <div className="space-y-4 shrink-0">
                    <DumpLoader onLoaded={handleLoaded} />
                    <StreamControls
                        onPlay={play}
                        onStop={stop}
                        status={status}
                        speed={speedMultiplier}
                        setSpeed={setSpeedMultiplier}
                        disabled={!hasEvents}
                    />
                </div>

                {/* Output Area */}
                <div className="flex-1 min-h-[300px] lg:min-h-0">
                    <StreamingOutput text={currentText} />
                </div>
            </div>

            <div className="w-full order-2 lg:order-none lg:h-[calc(100vh-200px)] min-h-[400px]">
                <VegaPreview currentText={currentText} />
            </div>
        </div>
    );
}
