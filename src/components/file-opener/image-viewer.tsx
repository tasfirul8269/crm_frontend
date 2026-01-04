'use client';

import React, { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileOpener } from './file-opener-context';

export function ImageViewer() {
    const { file, isOpen, closeFile } = useFileOpener();
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    if (!file || file.type !== 'image' || !isOpen) return null;

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = file.url;
        a.target = '_blank';
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
    const handleRotate = () => setRotation(prev => (prev + 90) % 360);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex flex-col animate-in fade-in duration-200"
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
                        onClick={handleZoomOut}
                        className="text-white hover:bg-white/20"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </Button>
                    <span className="text-white text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleZoomIn}
                        className="text-white hover:bg-white/20"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRotate}
                        className="text-white hover:bg-white/20"
                    >
                        <RotateCw className="w-5 h-5" />
                    </Button>
                    <div className="w-px h-6 bg-white/20 mx-2" />
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

            {/* Image */}
            <div
                className="flex-1 flex items-center justify-center overflow-auto p-8"
                onClick={e => e.stopPropagation()}
            >
                <img
                    src={file.url}
                    alt={file.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-200"
                    style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    }}
                    onClick={e => e.stopPropagation()}
                />
            </div>
        </div>
    );
}
