import ImageStrip from "@/components/image_strip";
import ImageWithDetailTable from "@/components/image_with_detail_table";
import TopInfoBar from "@/components/top_info_bar";
import { useImageContext } from "@/context/images_context";
import DecisionType from "@/lib/DecisionType";
import { useEffect } from "react";

export default function ReviewPage() {
    const { currentImagePosition, nextImage, previousImage, images, decisionForImage } = useImageContext();


    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            console.debug('Keydown:', event.key);
            switch (event.key) {
                case 'ArrowRight':
                    nextImage();
                    break;
                case 'ArrowLeft':
                    previousImage();
                    break;
                case 'p':
                    decisionForImage(images[currentImagePosition], DecisionType.Accept);
                    nextImage();
                    break;
                case 'x':
                    decisionForImage(images[currentImagePosition], DecisionType.Reject);
                    nextImage();
                    break;
                default:
                    break;
            }
        }
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        }
    }, [images, currentImagePosition, decisionForImage])



    return (
        <div className="mx-auto max-w-[1200px]">
            <TopInfoBar />
            <div className="flex flex-col h-full justify-between">
                <div className="grow overflow-auto">
                    <ImageWithDetailTable />
                </div>
                <div className="mt-4 overflow-y-hidden">
                    <ImageStrip />
                </div>
            </div>
        </div>

    );
}