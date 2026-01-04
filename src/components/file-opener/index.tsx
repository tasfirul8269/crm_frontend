'use client';

import { PDFViewer } from './pdf-viewer';
import { ImageViewer } from './image-viewer';
import { VideoPlayer } from './video-player';
import { AudioPlayer } from './audio-player';
import { useFileOpener } from './file-opener-context';

export function FileOpenerModals() {
    const { file, isOpen } = useFileOpener();

    if (!file || !isOpen) return null;

    return (
        <>
            <PDFViewer />
            <ImageViewer />
            <VideoPlayer />
            <AudioPlayer />
        </>
    );
}

export { FileOpenerProvider, useFileOpener, getFileType } from './file-opener-context';
export type { FileToOpen, FileType } from './file-opener-context';
