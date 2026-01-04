'use client';

import React, { useRef } from 'react';
import { X, Download, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileOpener } from './file-opener-context';

export function VideoPlayer() {
    const { file, isOpen, closeFile } = useFileOpener();
    const videoRef = useRef<HTMLVideoElement>(null);

    if (!file || file.type !== 'video' || !isOpen) return null;

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = file.url;
        a.target = '_blank';
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex flex-col animate-in fade-in duration-200"
            onClick={closeFile}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-sm"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-white font-medium truncate max-w-md">{file.name}</h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        className="text-white hover:bg-white/20"
                    >
                        <Download className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeFile}
                        className="text-white hover:bg-white/20"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            {/* Video Player */}
            <div
                className="flex-1 flex items-center justify-center p-8"
                onClick={e => e.stopPropagation()}
            >
                <video
                    ref={videoRef}
                    src={file.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full rounded-lg shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}
