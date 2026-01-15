import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { extractVegaSpec } from '../lib/parser';
import dynamic from 'next/dynamic';

// Use next/dynamic to load VegaEmbed safely with no SSR
const VegaEmbed = dynamic(
    () => import('react-vega').then((mod) => mod.VegaEmbed as any),
    { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Loading Vega...</div> }
) as any;

// Hardcoded data as per requirements
const HARDCODED_DATA = [
    { region: "Almaty", revenue: 120 },
    { region: "Astana", revenue: 90 },
    { region: "Shymkent", revenue: 70 }
];

interface VegaPreviewProps {
    currentText: string;
    minified?: boolean;
}

export function VegaPreview({ currentText, minified = false }: VegaPreviewProps) {
    const [spec, setSpec] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const extractedSafe = extractVegaSpec(currentText);

        if (extractedSafe) {
            // Inject data and modern styling
            const specWithData: any = {
                ...extractedSafe,
                data: { values: HARDCODED_DATA },
                width: "container", // Responsive width
                height: 400, // Taller fixed height
                autosize: { type: "fit", contains: "padding" },
                config: {
                    background: "transparent",
                    font: "Inter, sans-serif",
                    axis: {
                        domainColor: "#94a3b8",
                        gridColor: "#334155",
                        gridOpacity: 0.3,
                        tickColor: "#94a3b8",
                        labelColor: "#94a3b8",
                        titleColor: "#94a3b8",
                        labelFontSize: 12,
                        titleFontSize: 14,
                    },
                    legend: {
                        labelColor: "#94a3b8",
                        titleColor: "#94a3b8"
                    },
                    view: {
                        stroke: "transparent"
                    },
                    mark: {
                        cornerRadiusTopLeft: 4,
                        cornerRadiusTopRight: 4,
                    },
                    bar: {
                        color: {
                            value: "#3b82f6"
                        }
                    }
                },
                encoding: {
                    ...extractedSafe.encoding,
                    // Force a colorful encoding if it's missing or basic
                    color: extractedSafe.encoding?.color || {
                        field: "region",
                        type: "nominal",
                        scale: { range: ["#60a5fa", "#34d399", "#a78bfa"] },
                        legend: null // Hide legend if we just color bars by region
                    },
                    x: {
                        ...extractedSafe.encoding?.x,
                        axis: { labelAngle: 0 } // Keep labels horizontal
                    }
                },
                // Ensure schema is valid for Vega-Lite
                $schema: extractedSafe.$schema || 'https://vega.github.io/schema/vega-lite/v5.json'
            };

            // Basic validation: check for 'mark' and 'encoding'
            if (specWithData.mark && specWithData.encoding) {
                setSpec(specWithData);
                setError(null);
            }
        }
    }, [currentText]);

    const content = spec ? (
        <VegaEmbed
            spec={spec}
            actions={false}
            className="w-full h-full flex justify-center items-center"
        />
    ) : (
        <div className="text-muted-foreground text-sm">
            {minified ? null : "Waiting for valid Vega spec..."}
        </div>
    );

    if (minified) {
        if (!spec) return null; // Don't show anything if no spec in minified mode
        return (
            <div className="w-full mt-4 border-t pt-4">
                {content}
            </div>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg font-medium">Vega Chart Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-4 flex items-center justify-center min-h-[300px] bg-white">
                {content}
            </CardContent>
        </Card>
    );
}
