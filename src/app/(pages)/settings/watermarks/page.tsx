'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, Check, X, Loader2, Image as ImageIcon, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
    Watermark,
    getWatermarks,
    uploadWatermark,
    updateWatermark,
    activateWatermark,
    deactivateAllWatermarks,
    deleteWatermark,
} from '@/services/watermark.service';

const POSITION_OPTIONS = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'center', label: 'Center' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
];

export default function WatermarksSettingsPage() {
    const queryClient = useQueryClient();
    const [uploadName, setUploadName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedWatermark, setSelectedWatermark] = useState<Watermark | null>(null);

    // Local state for immediate slider feedback
    const [localOpacity, setLocalOpacity] = useState(80);
    const [localScale, setLocalScale] = useState(15);

    // Track pending changes and debounce timer
    const [hasPendingChanges, setHasPendingChanges] = useState(false);
    const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null);

    const { data: watermarks = [], isLoading } = useQuery({
        queryKey: ['watermarks'],
        queryFn: getWatermarks,
    });

    // Save pending changes function
    const savePendingChanges = useCallback(() => {
        if (selectedWatermark && hasPendingChanges) {
            updateMutation.mutate({
                id: selectedWatermark.id,
                data: {
                    opacity: localOpacity / 100,
                    scale: localScale / 100,
                }
            });
            setHasPendingChanges(false);
        }
    }, [selectedWatermark, hasPendingChanges, localOpacity, localScale]);

    // Debounced auto-save after 5 seconds of no slider activity
    useEffect(() => {
        if (hasPendingChanges && selectedWatermark) {
            // Clear existing timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            // Set new timer for 5 seconds
            debounceTimerRef.current = setTimeout(() => {
                savePendingChanges();
            }, 5000);
        }

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [localOpacity, localScale, hasPendingChanges, selectedWatermark]);

    // Sync selectedWatermark with watermarks list after API updates
    useEffect(() => {
        if (selectedWatermark) {
            const updated = watermarks.find(w => w.id === selectedWatermark.id);
            if (updated && !hasPendingChanges) {
                setSelectedWatermark(updated);
                setLocalOpacity(Math.round(updated.opacity * 100));
                setLocalScale(Math.round(updated.scale * 100));
            }
        }
    }, [watermarks]);

    // Initialize local state when selecting a watermark
    useEffect(() => {
        if (selectedWatermark) {
            setLocalOpacity(Math.round(selectedWatermark.opacity * 100));
            setLocalScale(Math.round(selectedWatermark.scale * 100));
            setHasPendingChanges(false);
        }
    }, [selectedWatermark?.id]);

    const uploadMutation = useMutation({
        mutationFn: ({ name, file }: { name: string; file: File }) => uploadWatermark(name, file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watermarks'] });
            toast.success('Watermark uploaded successfully');
            setUploadName('');
            setSelectedFile(null);
            setPreviewUrl(null);
        },
        onError: () => {
            toast.error('Failed to upload watermark');
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateWatermark(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watermarks'] });
            toast.success('Settings updated');
        },
        onError: () => {
            toast.error('Failed to update watermark');
        },
    });

    const activateMutation = useMutation({
        mutationFn: activateWatermark,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watermarks'] });
            toast.success('Watermark activated');
        },
        onError: () => {
            toast.error('Failed to activate watermark');
        },
    });

    const deactivateMutation = useMutation({
        mutationFn: deactivateAllWatermarks,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watermarks'] });
            toast.success('All watermarks deactivated');
        },
        onError: () => {
            toast.error('Failed to deactivate watermarks');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteWatermark,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watermarks'] });
            setSelectedWatermark(null);
            toast.success('Watermark deleted');
        },
        onError: () => {
            toast.error('Failed to delete watermark');
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            if (!uploadName) {
                setUploadName(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleUpload = () => {
        if (!selectedFile || !uploadName.trim()) {
            toast.error('Please provide a name and select a file');
            return;
        }
        uploadMutation.mutate({ name: uploadName.trim(), file: selectedFile });
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            if (!uploadName) {
                setUploadName(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    }, [uploadName]);

    const activeWatermark = watermarks.find(w => w.isActive);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Watermark Settings</h1>
                <p className="text-gray-500 mt-1">
                    Upload and manage watermarks for property images. The active watermark will be applied to all new property images.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Upload & List */}
                <div className="space-y-6">
                    {/* Upload Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Upload New Watermark</CardTitle>
                            <CardDescription>
                                Upload a PNG image with transparency for best results
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="watermark-name">Watermark Name</Label>
                                <Input
                                    id="watermark-name"
                                    value={uploadName}
                                    onChange={(e) => setUploadName(e.target.value)}
                                    placeholder="e.g., Company Logo"
                                    className="mt-1"
                                />
                            </div>

                            <div
                                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => document.getElementById('watermark-file')?.click()}
                            >
                                <input
                                    id="watermark-file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                {previewUrl ? (
                                    <div className="space-y-3">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="max-h-24 mx-auto object-contain"
                                        />
                                        <p className="text-sm text-gray-500">{selectedFile?.name}</p>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">
                                            Drag & drop or click to upload
                                        </p>
                                    </>
                                )}
                            </div>

                            <Button
                                onClick={handleUpload}
                                disabled={!selectedFile || !uploadName.trim() || uploadMutation.isPending}
                                className="w-full bg-[#00B7FF] hover:bg-[#0099DD]"
                            >
                                {uploadMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Upload className="w-4 h-4 mr-2" />
                                )}
                                Upload Watermark
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Watermarks List */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Your Watermarks</CardTitle>
                                {activeWatermark && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deactivateMutation.mutate()}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Use None
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : watermarks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No watermarks uploaded yet</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {watermarks.map((wm) => (
                                        <div
                                            key={wm.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedWatermark?.id === wm.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() => setSelectedWatermark(wm)}
                                        >
                                            <img
                                                src={wm.imageUrl}
                                                alt={wm.name}
                                                className="w-12 h-12 object-contain rounded bg-gray-100 p-1"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{wm.name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{wm.position.replace('-', ' ')}</p>
                                            </div>
                                            {wm.isActive ? (
                                                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                    <Check className="w-3 h-3" />
                                                    Active
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        activateMutation.mutate(wm.id);
                                                    }}
                                                    className="text-xs"
                                                >
                                                    Activate
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Settings */}
                <div>
                    <Card className="sticky top-8">
                        <CardHeader>
                            <CardTitle className="text-lg">Watermark Settings</CardTitle>
                            <CardDescription>
                                {selectedWatermark
                                    ? `Editing: ${selectedWatermark.name}`
                                    : 'Select a watermark to edit its settings'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedWatermark ? (
                                <div className="space-y-6">
                                    {/* Preview */}
                                    <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100" />
                                        <div
                                            className="absolute"
                                            style={{
                                                width: `${localScale}%`,
                                                opacity: localOpacity / 100,
                                                ...(selectedWatermark.position === 'top-left' && { top: 8, left: 8 }),
                                                ...(selectedWatermark.position === 'top-right' && { top: 8, right: 8 }),
                                                ...(selectedWatermark.position === 'center' && { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }),
                                                ...(selectedWatermark.position === 'bottom-left' && { bottom: 8, left: 8 }),
                                                ...(selectedWatermark.position === 'bottom-right' && { bottom: 8, right: 8 }),
                                            }}
                                        >
                                            <img
                                                src={selectedWatermark.imageUrl}
                                                alt={selectedWatermark.name}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Position */}
                                    <div>
                                        <Label className="mb-3 block">Position</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {POSITION_OPTIONS.map((pos) => (
                                                <button
                                                    key={pos.value}
                                                    onClick={() => updateMutation.mutate({
                                                        id: selectedWatermark.id,
                                                        data: { position: pos.value }
                                                    })}
                                                    className={`py-2 px-3 text-sm rounded-lg border transition-all ${selectedWatermark.position === pos.value
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {pos.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Opacity */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <Label>Opacity</Label>
                                            <span className="text-sm text-gray-500">
                                                {localOpacity}%
                                            </span>
                                        </div>
                                        <Slider
                                            value={[localOpacity]}
                                            onValueChange={(value) => {
                                                setLocalOpacity(value[0]);
                                                setHasPendingChanges(true);
                                            }}
                                            min={10}
                                            max={100}
                                            step={1}
                                        />
                                    </div>

                                    {/* Scale */}
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <Label>Size</Label>
                                            <span className="text-sm text-gray-500">
                                                {localScale}% of image width
                                            </span>
                                        </div>
                                        <Slider
                                            value={[localScale]}
                                            onValueChange={(value) => {
                                                setLocalScale(value[0]);
                                                setHasPendingChanges(true);
                                            }}
                                            min={5}
                                            max={50}
                                            step={1}
                                        />
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 pt-4 border-t">
                                        {!selectedWatermark.isActive && (
                                            <Button
                                                onClick={() => {
                                                    // Save pending changes first, then activate
                                                    if (hasPendingChanges) {
                                                        updateMutation.mutate({
                                                            id: selectedWatermark.id,
                                                            data: {
                                                                opacity: localOpacity / 100,
                                                                scale: localScale / 100,
                                                            }
                                                        }, {
                                                            onSuccess: () => {
                                                                setHasPendingChanges(false);
                                                                activateMutation.mutate(selectedWatermark.id);
                                                            }
                                                        });
                                                    } else {
                                                        activateMutation.mutate(selectedWatermark.id);
                                                    }
                                                }}
                                                className="flex-1 bg-[#00B7FF] hover:bg-[#0099DD]"
                                            >
                                                <Check className="w-4 h-4 mr-2" />
                                                Set as Active
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            onClick={() => deleteMutation.mutate(selectedWatermark.id)}
                                            className="flex-1"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Move className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>Select a watermark to configure position, size, and opacity</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
