import Image from "@/lib/Image";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "./ui/separator";
import LabelWidthText from "./labelWidthText";
import { Button } from "./ui/button";
import { useImageContext } from "@/context/images_context";
import DecisionType from "@/lib/DecisionType";


export default function FileInfoList({ image }: { image: Image }) {
    const { decisionForImage, nextImage } = useImageContext();

    const handleAccept = () => {
        console.debug('Accepting image:', image);
        decisionForImage(image, DecisionType.Accept);
        nextImage();
    }

    const handleReject = () => {
        console.debug('Rejecting image:', image);
        decisionForImage(image, DecisionType.Reject);
        nextImage();
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{image.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <LabelWidthText label="Size" text={`${image.exifTags?.width}x${image.exifTags?.height}`} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="Last Modified" text={image.lastModified?.toDateString() ?? ''} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="SHA256" text={image.sha256 ? `${image.sha256.substring(0, 12)}...` : ''} />
                <div className="flex flex-row gap-2">
                    <Button onClick={() => handleAccept()}>Accept</Button>
                    <Button onClick={() => handleReject()}>Reject</Button>
                </div>

            </CardContent>
        </Card>
    );
}