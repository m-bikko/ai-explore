import React, { ChangeEvent, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { parseJsonl, StreamEvent } from '../lib/parser';
import { Upload } from 'lucide-react';

interface DumpLoaderProps {
    onLoaded: (events: StreamEvent[]) => void;
}

export function DumpLoader({ onLoaded }: DumpLoaderProps) {
    const [fileName, setFileName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);
        setLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const events = parseJsonl(text);
                if (events.length === 0) {
                    setError('No valid events found in file.');
                } else {
                    onLoaded(events);
                }
            } catch (err) {
                setError('Failed to parse file.');
            } finally {
                setLoading(false);
            }
        };
        reader.onerror = () => {
            setError('Error reading file.');
            setLoading(false);
        };
        reader.readAsText(file);
    };

    return (
        <div className="flex items-center justify-between gap-4 p-3 border rounded-lg bg-background w-full">
            <div className="text-sm font-medium truncate flex-1 leading-none">
                {error ? <span className="text-red-500">{error}</span> : fileName || <span className="text-muted-foreground">No file selected</span>}
            </div>

            <Button variant="outline" size="sm" className="relative cursor-pointer shrink-0" asChild>
                <label>
                    <Upload className="mr-2 h-3.5 w-3.5" />
                    {loading ? 'Loading...' : 'Load Dump'}
                    <input
                        type="file"
                        accept=".jsonl,.json"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
            </Button>
        </div>
    );
}
