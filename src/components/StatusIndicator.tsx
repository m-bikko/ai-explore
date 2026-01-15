import React from 'react';
import { Badge } from './ui/badge';
import { StreamStatus } from '../lib/useStreamPlayer';

interface StatusIndicatorProps {
    status: StreamStatus;
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";

    if (status === 'streaming') variant = "default";
    if (status === 'done') variant = "secondary"; // green-ish usually implies success, secondary is often gray but distinguishable
    if (status === 'error') variant = "destructive";

    return (
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Status:</span>
            <Badge variant={variant} className="capitalize">{status}</Badge>
        </div>
    );
}
