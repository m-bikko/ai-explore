import { useState, useRef, useEffect, useCallback } from 'react';
import { StreamEvent } from './parser';

export type StreamStatus = 'idle' | 'streaming' | 'done' | 'error';

export function useStreamPlayer(events: StreamEvent[]) {
    const [status, setStatus] = useState<StreamStatus>('idle');
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [speedMultiplier, setSpeedMultiplier] = useState(1);

    // Queue for characters to be typed out
    const charQueue = useRef<string[]>([]);
    const queueProcessedRef = useRef(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const reset = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStatus('idle');
        setCurrentText('');
        setCurrentIndex(0);
        charQueue.current = [];
    }, []);

    const stop = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStatus((prev) => (prev === 'streaming' ? 'idle' : prev));
    }, []);

    const play = useCallback(() => {
        if (status === 'streaming') return;
        if (status === 'done' || status === 'error') {
            reset();
            // Allow state to settle, then start. 
            // In React 18 auto-batching might make this instant, 
            // but setting status streaming effectively restarts logic.
            setTimeout(() => setStatus('streaming'), 0);
            return;
        }
        setStatus('streaming');
    }, [status, reset]);

    // Main Loop: Consumes events and fills the character queue
    useEffect(() => {
        // If we are not streaming, or we are done pushing events, do nothing here
        if (status !== 'streaming') return;

        // If we processed all events, we just wait for queue to drain
        if (currentIndex >= events.length) {
            // We don't verify status='done' here immediately, we let the queue drainer handle it
            return;
        }

        const processNextEvent = () => {
            // Before processing next event, check if queue is too full (backpressure)
            // If queue has > 50 chars, wait a bit to let it drain, so we don't look like we parsed everything instantly
            if (charQueue.current.length > 50) {
                timerRef.current = setTimeout(processNextEvent, 50);
                return;
            }

            const event = events[currentIndex];

            if (event.event === 'token') {
                // Split token into characters and push to queue
                // We split by standard chars. 
                // For emojis or complex scripts we might need Array.from(delta)
                const chars = Array.from(event.data.delta || '');
                charQueue.current.push(...chars);
                setCurrentIndex((prev) => prev + 1);
            } else if (event.event === 'done') {
                // We reached the end of events. 
                // We should NOT set status='done' yet. The queue needs to empty first.
                // We'll increment index to show we handled this event.
                setCurrentIndex((prev) => prev + 1);
                // We don't need to push anything to queue
            } else if (event.event === 'error') {
                setStatus('error');
                return;
            }

            // Schedule next event processing
            // The events in dump are infrequent tokens, so we can process them relatively quickly
            // expecting the typing loop to be the limiter.
            timerRef.current = setTimeout(processNextEvent, 10);
        };

        processNextEvent();

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [status, currentIndex, events]);


    // Render Loop: Consumes from character queue and updates UI
    // This runs independently to create smooth typing effect
    useEffect(() => {
        if (status !== 'streaming') return;

        let animationFrameId: number;
        let lastTime = Date.now();

        // Typing speed configuration
        // Base chars per second approx 30-60 feels natural? 
        // Let's say 20ms per char = 50 chars/sec.
        const baseMsPerChar = 20;

        const animate = () => {
            const now = Date.now();
            const msPerChar = baseMsPerChar / speedMultiplier;
            const delta = now - lastTime;

            if (delta >= msPerChar) {
                // Time to type a character!
                if (charQueue.current.length > 0) {
                    const nextChar = charQueue.current.shift();
                    if (nextChar) {
                        setCurrentText((prev) => prev + nextChar);
                    }
                    lastTime = now;
                } else {
                    // Queue is empty. 
                    // Verify if we are actually done with all events.
                    if (currentIndex >= events.length) {
                        setStatus('done');
                        return; // Stop loop
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [status, speedMultiplier, currentIndex, events.length]); // Dependencies needed

    return {
        status,
        currentText,
        play,
        stop,
        reset,
        // Approximate progress based on events processed vs total
        // Note: rendering might lag behind slightly due to queue
        progress: events.length > 0 ? (currentIndex / events.length) * 100 : 0,
        setSpeedMultiplier,
        speedMultiplier
    };
}
