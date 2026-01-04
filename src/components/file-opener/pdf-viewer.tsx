'use client';

import React from 'react';
import { X, Download, Printer, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFileOpener } from './file-opener-context';

export function PDFViewer() {
    const { file, isOpen, closeFile } = useFileOpener();

    if (!file || file.type !== 'pdf' || !isOpen) return null;

    const handleDownload = () => {
        const a = document.createElement('a');
        a.href = file.url;
        a.target = '_blank';
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handlePrint = () => {
        const printWindow = window.open(file.url, '_blank');
        if (printWindow) {
            printWindow.onload = () => printWindow.print();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <h2 className="text-white font-medium truncate max-w-md">{file.name}</h2>
                </div>
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
                        onClick={handlePrint}
                        className="text-white hover:bg-white/20"
                    >
                        <Printer className="w-5 h-5" />
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

            {/* PDF Viewer */}
            <div className="flex-1 p-4">
                <iframe
                    src={`${file.url}#toolbar=0`}
                    className="w-full h-full rounded-lg bg-white"
                    title={file.name}
                />
            </div>
        </div>
    );
}
