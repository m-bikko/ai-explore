"use client";

import React, { useState } from 'react';
import { DashboardMode } from '@/components/DashboardMode';
import { ChatMode } from '@/components/ChatMode';
import { StatusIndicator } from '@/components/StatusIndicator';
import { useStreamPlayer } from '@/lib/useStreamPlayer';
import { StreamEvent } from '@/lib/parser';
import { Switch } from '@/components/ui/switch';
import { LayoutDashboard, MessageSquare } from 'lucide-react';

export default function AIExplorePage() {
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [mode, setMode] = useState<'dashboard' | 'chat'>('dashboard');

  const {
    status,
    currentText,
    play,
    stop,
    reset,
    setSpeedMultiplier,
    speedMultiplier
  } = useStreamPlayer(events);

  const handleLoaded = (loadedEvents: StreamEvent[]) => {
    reset();
    setEvents(loadedEvents);
  };

  const hasEvents = events.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 lg:p-8 pb-4 border-b bg-white dark:bg-slate-950 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              AI Explore
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Mode Toggle */}
            <div className="flex items-center space-x-2">
              <div className={`flex items-center gap-2 text-sm ${mode === 'dashboard' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </div>
              <Switch
                id="mode-toggle"
                checked={mode === 'chat'}
                onCheckedChange={(checked) => setMode(checked ? 'chat' : 'dashboard')}
              />
              <div className={`flex items-center gap-2 text-sm ${mode === 'chat' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chat Bot</span>
              </div>
            </div>

            <div className="h-6 w-px bg-border" />

            <StatusIndicator status={status} />
          </div>
        </header>

        <main className="p-4 lg:p-8">
          {mode === 'dashboard' ? (
            <DashboardMode
              status={status}
              currentText={currentText}
              play={play}
              stop={stop}
              speedMultiplier={speedMultiplier}
              setSpeedMultiplier={setSpeedMultiplier}
              hasEvents={hasEvents}
              handleLoaded={handleLoaded}
            />
          ) : (
            <ChatMode
              status={status}
              currentText={currentText}
              play={play}
              stop={stop}
              speedMultiplier={speedMultiplier}
              setSpeedMultiplier={setSpeedMultiplier}
              hasEvents={hasEvents}
              handleLoaded={handleLoaded}
            />
          )}
        </main>
      </div>
    </div>
  );
}
