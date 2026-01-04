'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type FileType = 'pdf' | 'image' | 'video' | 'audio' | 'other';

export interface FileToOpen {
    url: string;
    name: string;
    type: FileType;
}

interface FileOpenerContextType {
    file: FileToOpen | null;
    isOpen: boolean;
    openFile: (file: FileToOpen) => void;
    closeFile: () => void;
}

const FileOpenerContext = createContext<FileOpenerContextType | null>(null);

export function useFileOpener() {
    const context = useContext(FileOpenerContext);
    if (!context) {
        throw new Error('useFileOpener must be used within a FileOpenerProvider');
    }
    return context;
}

// Helper function to determine file type from URL or extension
export function getFileType(url: string): FileType {
    const extension = url.split('.').pop()?.toLowerCase() || '';

    // PDF
    if (extension === 'pdf') return 'pdf';

    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(extension)) {
        return 'image';
    }

    // Videos
    if (['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'].includes(extension)) {
        return 'video';
    }

    // Audio
    if (['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(extension)) {
        return 'audio';
    }

    return 'other';
}

export function FileOpenerProvider({ children }: { children: React.ReactNode }) {
    const [file, setFile] = useState<FileToOpen | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const openFile = useCallback((newFile: FileToOpen) => {
        // Skip opening for fonts and archives
        const extension = newFile.url.split('.').pop()?.toLowerCase() || '';
        const skipExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'ttf', 'otf', 'woff', 'woff2', 'eot'];

        if (skipExtensions.includes(extension)) {
            // Just download these files
            window.open(newFile.url, '_blank');
            return;
        }

        setFile(newFile);
        setIsOpen(true);
    }, []);

    const closeFile = useCallback(() => {
        setIsOpen(false);
        // Delay clearing file to allow animation
        setTimeout(() => setFile(null), 300);
    }, []);

    return (
        <FileOpenerContext.Provider value={{ file, isOpen, openFile, closeFile }}>
            {children}
        </FileOpenerContext.Provider>
    );
}
