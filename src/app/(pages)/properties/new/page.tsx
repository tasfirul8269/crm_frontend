'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CategorySelectionStep } from '@/components/properties/category-selection-step';
import { Loader2 } from 'lucide-react';
import { CreateNocPageContent, NocData } from '@/components/noc/create-noc-page-content';

// Loading component for dynamic chunks
const StepLoader = () => (
    <div className="flex w-full h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00B7FF]" />
    </div>
);

const PurposeSelectionStep = dynamic(
    () => import('@/components/properties/purpose-selection-step').then(mod => mod.PurposeSelectionStep),
    { loading: () => <StepLoader /> }
);

const NocSelectionStep = dynamic(
    () => import('@/components/properties/noc-selection-step').then(mod => mod.NocSelectionStep),
    { loading: () => <StepLoader /> }
);

const PropertyFormStep = dynamic(
    () => import('@/components/properties/property-form-step').then(mod => mod.PropertyFormStep),
    { loading: () => <StepLoader /> }
);

export default function AddPropertyPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<'residential' | 'commercial' | ''>('');
    const [selectedPurpose, setSelectedPurpose] = useState<'sell' | 'rent' | ''>('');
    const [nocFile, setNocFile] = useState<File | null>(null);
    const [showCreateNoc, setShowCreateNoc] = useState(false);
    const [createdNocData, setCreatedNocData] = useState<NocData | null>(null);

    const handleCategorySelect = (category: 'residential' | 'commercial') => {
        setSelectedCategory(category);
    };

    const handlePurposeSelect = (purpose: 'sell' | 'rent') => {
        setSelectedPurpose(purpose);
    };

    const handleNext = () => {
        if (currentStep === 0 && selectedCategory) {
            setCurrentStep(1);
        } else if (currentStep === 1 && selectedPurpose) {
            setCurrentStep(2);
        } else if (currentStep === 2 && nocFile) {
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const handleCreateNocClick = () => {
        setShowCreateNoc(true);
    };

    const handleNocCreated = async (nocData: NocData) => {
        setCreatedNocData(nocData);
        setShowCreateNoc(false);

        // Create a file object from the PDF URL
        if (nocData.pdfUrl) {
            try {
                const response = await fetch(nocData.pdfUrl);
                const blob = await response.blob();
                const nocFile = new File([blob], `noc-${nocData.id}.pdf`, { type: 'application/pdf' });
                setNocFile(nocFile);
                // Directly go to property form step after NOC creation
                setCurrentStep(3);
            } catch (error) {
                console.error('Error fetching created NOC PDF:', error);
                // Create a dummy file as fallback
                const dummyBlob = new Blob(['NOC PDF'], { type: 'application/pdf' });
                const nocFileObj = new File([dummyBlob], `noc-${nocData.id}.pdf`, { type: 'application/pdf' });
                setNocFile(nocFileObj);
                setCurrentStep(3);
            }
        }
    };

    const handleBackFromCreateNoc = () => {
        setShowCreateNoc(false);
    };

    // If showing Create NOC page (full screen)
    if (showCreateNoc) {
        return (
            <div className="h-full">
                <CreateNocPageContent
                    onNocCreated={handleNocCreated}
                    onBack={handleBackFromCreateNoc}
                />
            </div>
        );
    }

    return (
        <div className={`h-full p-8 ${currentStep === 3 ? '' : 'flex items-center justify-center'}`}>
            <div className={currentStep === 3 ? "w-full" : "w-full max-w-4xl"}>
                {currentStep === 0 && (
                    <CategorySelectionStep
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleCategorySelect}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}

                {currentStep === 1 && (
                    <PurposeSelectionStep
                        selectedPurpose={selectedPurpose}
                        onSelectPurpose={handlePurposeSelect}
                        onNext={handleNext}
                        onBack={handleBack}
                    />
                )}

                {currentStep === 2 && (
                    <NocSelectionStep
                        file={nocFile}
                        onFileChange={setNocFile}
                        onNext={handleNext}
                        onBack={handleBack}
                        onCreateNocClick={handleCreateNocClick}
                        createdNocPdfUrl={createdNocData?.pdfUrl}
                    />
                )}

                {currentStep === 3 && (
                    <PropertyFormStep
                        nocFile={nocFile}
                        category={selectedCategory}
                        purpose={selectedPurpose}
                        onBack={handleBack}
                        nocData={createdNocData}
                    />
                )}
            </div>
        </div>
    );
}
