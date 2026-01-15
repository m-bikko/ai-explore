import React from 'react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Play, Square, FastForward } from 'lucide-react';
import { StreamStatus } from '../lib/useStreamPlayer';

interface StreamControlsProps {
    onPlay: () => void;
    onStop: () => void;
    status: StreamStatus;
    speed: number;
    setSpeed: (speed: number) => void;
    disabled: boolean;
}

export function StreamControls({ onPlay, onStop, status, speed, setSpeed, disabled }: StreamControlsProps) {
    return (
        <div className="flex flex-col gap-3 border p-3 rounded-lg bg-background w-full">
            {/* Top Row: Buttons */}
            <div className="flex items-center gap-3 w-full">
                <Button
                    size="sm"
                    onClick={onPlay}
                    disabled={disabled || status === 'streaming'}
                    variant={status === 'streaming' ? 'secondary' : 'default'}
                    className="flex-1"
                >
                    <Play className="h-4 w-4 mr-2" />
                    {status === 'done' || status === 'error' ? 'Replay' : 'Play'}
                </Button>

                <Button
                    size="sm"
                    variant="destructive"
                    onClick={onStop}
                    disabled={disabled || status === 'idle'}
                    className="flex-1"
                >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                </Button>
            </div>

            {/* Bottom Row: Speed Control */}
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-md w-full">
                <FastForward className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 mx-2">
                    <Slider
                        value={[speed]}
                        min={0.5}
                        max={5}
                        step={0.5}
                        onValueChange={(val) => setSpeed(val[0])}
                        className="cursor-pointer"
                    />
                </div>
                <span className="text-xs font-mono text-muted-foreground w-8 text-right shrink-0">x{speed.toFixed(1)}</span>
            </div>
        </div>
    );
}
