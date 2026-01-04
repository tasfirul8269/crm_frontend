'use client';

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, Eye, Download, Printer, ArrowLeft, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFileOpener } from '@/components/file-opener';

export default function TenancySuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { openFile } = useFileOpener();
    const pdfUrl = searchParams.get('pdfUrl');

    const handleView = () => {
        if (pdfUrl) {
            openFile({
                url: pdfUrl,
                name: 'Tenancy Contract.pdf',
                type: 'pdf'
            });
        }
    };

    const handleDownload = () => {
        if (!pdfUrl) return;

        // Create a direct download link
        const a = document.createElement('a');
        a.href = pdfUrl;
        a.target = '_blank';
        a.download = `tenancy-contract-${new Date().toISOString().split('T')[0]}.pdf`;
        // For cross-origin URLs, we can't force download, so we just open in new tab
        // The user can then save from there
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handlePrint = () => {
        if (!pdfUrl) return;

        // Open PDF in new window and print
        const printWindow = window.open(pdfUrl, '_blank');
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center p-8">
            <Card className="w-full max-w-lg shadow-xl border-0">
                <CardContent className="pt-12 pb-8 px-8">
                    <div className="text-center">
                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            Contract Created Successfully!
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Your tenancy contract has been generated and is ready to use.
                        </p>

                        {/* PDF Preview */}
                        {pdfUrl && (
                            <div className="bg-gray-100 rounded-xl p-6 mb-8">
                                <div className="flex items-center justify-center gap-3 text-gray-600 mb-4">
                                    <FileText className="w-8 h-8" />
                                    <span className="font-medium">Tenancy Contract PDF</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-3 gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleView}
                                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                                    >
                                        <Eye className="w-5 h-5" />
                                        <span className="text-xs font-medium">View</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handleDownload}
                                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-green-50 hover:border-green-200 hover:text-green-600"
                                    >
                                        <Download className="w-5 h-5" />
                                        <span className="text-xs font-medium">Download</span>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={handlePrint}
                                        className="flex flex-col items-center gap-2 h-auto py-4 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600"
                                    >
                                        <Printer className="w-5 h-5" />
                                        <span className="text-xs font-medium">Print</span>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Back Button */}
                        <Button
                            onClick={() => router.push('/tenancy/create')}
                            className="w-full bg-[#00B7FF] hover:bg-[#0099DD] h-12"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Create Another Contract
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
