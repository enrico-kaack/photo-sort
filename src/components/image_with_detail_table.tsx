import { useImageContext } from "@/context/images_context";
import FileInfoList from "./file_info_list";
import ExifInfoList from "./exif_info_list";

export default function ImageWithDetailTable() {
    const { currentImagePosition, images } = useImageContext();

    return (
        <div className="flex flex-row gap-1">
            <div className="basis-2/12">
                {images.length > 0 && <FileInfoList image={images[currentImagePosition]} />}
            </div>

            <div className="basis-8/12">
                {images.length > 0 && <img src={images[currentImagePosition].getDataUrl()} alt={images[currentImagePosition].name}></img>}
            </div>
            <div className="basis-2/12">
                {images.length > 0 && <ExifInfoList image={images[currentImagePosition]} />}
            </div>
        </div>
    );
}