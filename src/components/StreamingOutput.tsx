import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface StreamingOutputProps {
    text: string;
}

export function StreamingOutput({ text }: StreamingOutputProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [text]);

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-medium">Streaming Output</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative min-h-[300px]">
                <div className="absolute inset-0 p-4 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
                    {text}
                    <div ref={bottomRef} className="h-4" />
                </div>
            </CardContent>
        </Card>
    );
}
