import DecisionType from '@/lib/DecisionType';
import Image from '@/lib/Image';
import { ProgresStats } from '@/lib/ProgressStats';
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the context
interface ImagesContextType {
    currentImagePosition: number;
    setCurrentImagePosition: (position: number) => void;
    images: Image[];
    imagesNotAlreadyExcludedFromLoadedChoices: Image[];

    setImages: (images: Image[]) => void;
    //maps sha256 to decision
    decisions: { [key: string]: DecisionType };
    setDecisions: (decisions: { [key: string]: DecisionType }) => void;

    nextImage: () => void;
    previousImage: () => void;

    decisionForImage: (image: Image, decision: DecisionType) => void;

    progressStats: ProgresStats;
}

// Create the context with a default value
const ImagesContext = createContext<ImagesContextType | undefined>(undefined);

// Create a provider component
const ImagesContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentImagePosition, setCurrentImagePosition] = useState<number>(0);
    const [images, setImages] = useState<Image[]>([]);
    const [decisions, setDecisions] = useState<{ [key: string]: DecisionType }>({});

    const nextImage = () => {
        if (currentImagePosition + 1 >= images.length) {
            console.debug('No more images');
            return;
        }
        setCurrentImagePosition((currentImagePosition + 1));
    }

    const previousImage = () => {
        if (currentImagePosition - 1 < 0) {
            return;
        }
        setCurrentImagePosition(currentImagePosition - 1);
    }

    const decisionForImage = (image: Image, decision: DecisionType) => {
        if (image.sha256 == undefined) {
            throw ('Image sha256 is undefined');
        }
        console.debug('Setting decision for:', image.sha256, decision);
        setDecisions((prev) => {
            const oldDecisions = { ...prev };
            oldDecisions[image.sha256] = decision;
            return oldDecisions;
        })
    }

    const progressStats = new ProgresStats(images.length, Object.values(decisions).filter((decision) => decision === DecisionType.Accept).length, Object.values(decisions).filter((decision) => decision === DecisionType.Reject).length, Object.values(decisions).filter((decision) => decision === DecisionType.LoadedAccepted).length, Object.values(decisions).filter((decision) => decision === DecisionType.LoadedRejected).length);

    const imagesNotAlreadyExcludedFromLoadedChoices = images.filter(image => decisions[image.sha256] !== DecisionType.LoadedRejected && decisions[image.sha256] !== DecisionType.LoadedAccepted);

    return (
        <ImagesContext.Provider value={{
            currentImagePosition, setCurrentImagePosition, images, setImages, decisions, setDecisions,
            nextImage, previousImage, decisionForImage, progressStats, imagesNotAlreadyExcludedFromLoadedChoices
        }}>
            {children}
        </ImagesContext.Provider>
    );
};

// Custom hook to use the ImagePositionContext
const useImageContext = () => {
    const context = useContext(ImagesContext);
    if (context === undefined) {
        throw new Error('useImageContext must be used within an ImagePositionProvider');
    }
    return context;
};
export { ImagesContextProvider, useImageContext };