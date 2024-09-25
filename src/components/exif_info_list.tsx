import Image from "@/lib/Image";
import LabelWidthText from "./labelWidthText";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

export default function ExifInfoList({ image }: { image: Image }) {

    const cardContent
        = (
            <CardContent>
                <LabelWidthText label="Make" text={image.exifTags?.make ?? ''} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="Model" text={image.exifTags?.model ?? ''} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="Exposure Time" text={image.exifTags?.exposureTime ?? ''} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="F Number" text={image.exifTags?.fNumber ?? ''} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="ISO" text={image.exifTags?.iso ?? ''} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="Focal Length" text={image.exifTags?.focalLength ?? ''} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="Lens Model" text={image.exifTags?.lensModel ?? ''} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="Latitude" text={image.exifTags?.latitude ?? ''} />
                <Separator orientation="horizontal" />
                <LabelWidthText label="Longitude" text={image.exifTags?.longitude ?? ''} />
            </CardContent>
        )





    return (
        <Card>
            <CardHeader>
                <CardTitle>Metadata</CardTitle>
            </CardHeader>
            {cardContent}
        </Card>
    );
}