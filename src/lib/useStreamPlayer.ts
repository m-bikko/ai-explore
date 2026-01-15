import { useState, useRef, useEffect, useCallback } from 'react';
import { StreamEvent } from './parser';

export type StreamStatus = 'idle' | 'streaming' | 'done' | 'error';

export function useStreamPlayer(events: StreamEvent[]) {
    const [status, setStatus] = useState<StreamStatus>('idle');
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const reset = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStatus('idle');
        setCurrentText('');
        setCurrentIndex(0);
    }, []);

    const stop = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStatus((prev) => (prev === 'streaming' ? 'idle' : prev));
    }, []);

    const play = useCallback(() => {
        if (status === 'streaming') return;
        if (status === 'done' || status === 'error') {
            reset();
            // Need to let state update before restarting, but since play sets status to streaming, 
            // the effect should pick it up if we handle it correctly. 
            // Actually simpler: if done, reset then start.
            setStatus('streaming');
            return;
        }
        setStatus('streaming');
    }, [status, reset]);

    useEffect(() => {
        if (status !== 'streaming') return;

        if (currentIndex >= events.length) {
            setStatus('done');
            return;
        }

        const processNextEvent = () => {
            const event = events[currentIndex];

            if (event.event === 'token') {
                setCurrentText((prev) => prev + event.data.delta);
            } else if (event.event === 'done') {
                setStatus('done');
                return; // Stop processing
            } else if (event.event === 'error') {
                setStatus('error');
                return; // Stop processing
            }

            setCurrentIndex((prev) => prev + 1);
        };

        // Calculate delay: 50-150ms normally.
        // user wants play speed control? Bonus.
        // "50–150 мс"
        const baseDelay = Math.random() * 100 + 50;
        const delay = baseDelay / speedMultiplier;

        timerRef.current = setTimeout(processNextEvent, delay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [status, currentIndex, events, speedMultiplier]);

    return {
        status,
        currentText,
        play,
        stop,
        reset,
        progress: events.length > 0 ? (currentIndex / events.length) * 100 : 0,
        setSpeedMultiplier,
        speedMultiplier
    };
}
