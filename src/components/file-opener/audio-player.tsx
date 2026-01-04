'use client';

import React, { useRef, useState } from 'react';
import { X, Download, Play, Pause, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileOpener } from './file-opener-context';

export function AudioPlayer() {
    const { file, isOpen, closeFile } = useFileOpener();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    if (!file || file.type !== 'audio' || !isOpen) return null;

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = file.url;
        a.target = '_blank';
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-in fade-in duration-200"
            onClick={closeFile}
        >
            <div
                className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <div className="flex justify-end mb-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeFile}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Album art placeholder */}
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Music className="w-16 h-16 text-white/80" />
                </div>

                {/* Title */}
                <h2 className="text-white font-medium text-center mb-6 truncate">{file.name}</h2>

                {/* Progress bar */}
                <div className="mb-4">
                    <input
                        type="range"
                        min={0}
                        max={duration || 100}
                        value={progress}
                        onChange={handleSeek}
                        className="w-full h-1 bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>{formatTime(progress)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        className="text-gray-400 hover:text-white hover:bg-white/10"
                    >
                        <Download className="w-5 h-5" />
                    </Button>
                    <Button
                        onClick={togglePlay}
                        className="w-14 h-14 rounded-full bg-white hover:bg-gray-200 text-black"
                    >
                        {isPlaying ? (
                            <Pause className="w-6 h-6" />
                        ) : (
                            <Play className="w-6 h-6 ml-1" />
                        )}
                    </Button>
                    <div className="w-10" /> {/* Spacer for balance */}
                </div>

                {/* Hidden audio element */}
                <audio
                    ref={audioRef}
                    src={file.url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>
        </div>
    );
}
