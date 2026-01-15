import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { extractVegaSpec } from '../lib/parser';
import dynamic from 'next/dynamic';

// Use next/dynamic to load VegaEmbed safely with no SSR
const VegaEmbed = dynamic(
    () => import('react-vega').then((mod) => mod.VegaEmbed as any),
    { ssr: false, loading: () => <div className="text-sm text-muted-foreground">Загрузка Vega...</div> }
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

// ... imports
import { Badge } from './ui/badge'; // You might need to check if this exists or use a simple span
import { Database, Table } from 'lucide-react';

// ... HARDCODED_DATA ...

export function VegaPreview({ currentText, minified = false }: VegaPreviewProps) {
    const [spec, setSpec] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [dataStatus, setDataStatus] = useState<'sample' | 'live'>('sample');

    useEffect(() => {
        const extractedSafe = extractVegaSpec(currentText);

        if (extractedSafe) {
            // Check if the spec already has data
            const hasData = extractedSafe.data && (extractedSafe.data.values || extractedSafe.data.url);


            // Determine type for spec
            let specWithData: Record<string, any>;

            if (hasData) {
                specWithData = {
                    ...extractedSafe,
                    width: "container",
                    height: 400,
                    autosize: { type: "fit", contains: "padding" },
                    config: {
                        background: "transparent",
                        font: "Inter, sans-serif",
                        // ... styling config ...
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
                    }
                    // Keep original mark/encoding
                };
                setDataStatus('live');
            } else {
                // FALLBACK: Inject data and force styling
                specWithData = {
                    ...extractedSafe,
                    data: { values: HARDCODED_DATA },
                    width: "container",
                    height: 400,
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
                setDataStatus('sample');
            }

            // Basic validation
            if ((specWithData.mark || specWithData.layer) && (specWithData.encoding || specWithData.layer)) {
                setSpec(specWithData);
                setError(null);
            }
        } else {
            setSpec(null);
        }
    }, [currentText]);

    const content = spec ? (
        <div className="w-full h-full relative group/chart">
            {/* Data Status Indicator */}
            {!minified && (
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover/chart:opacity-100 transition-opacity">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${dataStatus === 'live'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                        }`}>
                        {dataStatus === 'live' ? <Database className="w-3 h-3" /> : <Table className="w-3 h-3" />}
                        {dataStatus === 'live' ? 'Живые данные' : 'Пример данных'}
                    </span>
                </div>
            )}

            <VegaEmbed
                spec={spec}
                options={{ actions: false }}
                className="w-full h-full flex justify-center items-center"
            />
        </div>
    ) : (
        // ... waiting ...
        <div className="text-muted-foreground text-sm">
            {minified ? null : "Ожидание валидной спецификации Vega..."}
        </div>
    );

    // ... rest of renders
    if (minified) {
        if (!spec) return null;
        return (
            <div className="w-full mt-4 border-t pt-4">
                {content}
            </div>
        );
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">Предпросмотр графика Vega</CardTitle>
                {/* Status can also go here for Dashboard mode */}
                {spec && (
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${dataStatus === 'live'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800'
                        }`}>
                        {dataStatus === 'live' ? 'LIVE' : 'ПРИМЕР'}
                    </span>
                )}
            </CardHeader>
            <CardContent className="flex-1 p-4 flex items-center justify-center min-h-[300px] bg-white dark:bg-slate-950">
                {content}
            </CardContent>
        </Card>
    );
}
