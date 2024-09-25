import { ImageWithProgress, ProgressType } from "@/lib/Image";
import { Check, CopyCheck, Loader, ShieldAlert } from "lucide-react";

export default function ImageWithProgressGridIcon({ image }: { image: ImageWithProgress }) {
    return (
        <div>
            <img src={image.img.getDataUrl()} />
            <div className="flex flex-row justify-between">
                <p className="truncate">{image.img.name}</p>
                {image.progress === ProgressType.Pending && <Loader className="animation-rotating" />}
                {image.progress === ProgressType.Completed && <Check />}
                {image.progress === ProgressType.AlreadyExisted && <CopyCheck />}
                {image.progress === ProgressType.Error && <ShieldAlert />}
            </div>
        </div>
    );
}
