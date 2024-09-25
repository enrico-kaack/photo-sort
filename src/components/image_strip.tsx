import { useImageContext } from "@/context/images_context";
import DecisionType from "@/lib/DecisionType";
import { cn } from "@/lib/utils";
import { FileClock, SquareCheckBig, SquareX } from "lucide-react";
import { useEffect, useRef } from "react";


export default function ImageStrip() {
    const scrollDemoRef = useRef<HTMLDivElement>(null);

    const { currentImagePosition, setCurrentImagePosition, images, decisions } = useImageContext();

    useEffect(() => {
        calculateScrollPosition();
    }, [currentImagePosition]);

    const calculateScrollPosition = () => {
        if (scrollDemoRef.current && scrollDemoRef.current.children.length > 0) {
            // console.debug('calculating scroll position', scrollDemoRef);
            const imageWidth = scrollDemoRef.current.children[0].scrollWidth + 16; //offset for margin or border
            const divWidth = scrollDemoRef.current.clientWidth;
            const fullStripWidht = imageWidth * images.length;
            const currentMidpoint = imageWidth * currentImagePosition + imageWidth / 2;
            const leftStartingPoint = currentMidpoint - divWidth / 2;
            // console.debug('imageWidth', imageWidth, 'divWidth', divWidth, 'fullStripWidht', fullStripWidht, 'currentMidpoint', currentMidpoint, 'leftStartingPoint', leftStartingPoint);

            if (leftStartingPoint < 0) {
                // console.debug('scrolling to 0');
                scrollDemoRef.current.scrollLeft = 0;
            }
            else if (leftStartingPoint > fullStripWidht - divWidth) {
                // console.debug('scrolling to end');
                scrollDemoRef.current.scrollLeft = fullStripWidht - divWidth;
            }
            else {
                // console.debug('scrolling to midpoint', leftStartingPoint);
                scrollDemoRef.current.scrollLeft = leftStartingPoint;
            }

        }
    }

    const handleImageClick = (index: number) => {
        setCurrentImagePosition(index);
    }

    const imagesToShow = images.map((image, index) => {
        const decision = decisions[image.sha256 ?? DecisionType.Pending];
        return (
            <div key={index} className={cn((index == currentImagePosition ? 'border-8 border-stone-400' : 'border-0 m-2'), "relative")} onClick={() => handleImageClick(index)}>
                <img src={image.getDataUrl()} alt={image.name} className={`min-w-[400px] max-w-[400px]  ${decision === DecisionType.Reject || decision === DecisionType.LoadedAccepted || decision === DecisionType.LoadedRejected ? 'filter grayscale' : ''}`} loading="lazy" />
                <div className="absolute top-2 right-2 m-2">
                    {decision == DecisionType.Accept && <div className="bg-white/50 text-green-700 p-2 rounded-full"><SquareCheckBig /></div>}
                    {decision == DecisionType.Reject && <div className="bg-white/50 text-red-600 p-2 rounded-full"><SquareX /></div>}
                    {decision == DecisionType.LoadedAccepted && <div className="bg-white/50 text-gray-700 p-2 rounded-full"><FileClock /></div>}
                    {decision == DecisionType.LoadedRejected && <div className="bg-white/50 text-gray-700 p-2 rounded-full"><FileClock /></div>}
                </div>
            </div >
        )
    }
    )
    return (
        <div ref={scrollDemoRef} className="h-[300px] flex flex-row overflow-x-scroll overflow-y-clip w-full">
            {imagesToShow}
        </div>
    );
}