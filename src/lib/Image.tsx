import * as ExifReader from 'exifreader';
import DecisionType from './DecisionType';
import { FileHandleWithDirectory } from './ImageWalker';

export default class Image {
    private _fileSystemHandleWithDirectory: FileHandleWithDirectory;
    private _file: File | undefined;
    private _name: string | undefined;
    private _lastModified: Date | undefined;
    private _sha256: string | undefined;
    private _exifTags: ImageExifData | undefined;

    get name() {
        return this._name ?? '';
    }
    get lastModified() {
        return this._lastModified;
    }
    get exifTags() {
        return this._exifTags;
    }
    get sha256(): string {
        if (this._sha256 === undefined) {
            throw new Error('sha256 is undefined, file probably not loaded');
        }
        return this._sha256;
    }
    get arrayBuffer() {
        if (!this._file) {
            throw new Error('File not loaded');
        }
        return this._file.arrayBuffer();
    }
    get directories() {
        return this._fileSystemHandleWithDirectory.directory;
    }

    async calculateSha256() {
        if (!this._file) {
            throw new Error('File not loaded');
        }
        return await sha26ForFile(this._file);
    }

    constructor(fileSystemHandle: FileHandleWithDirectory) {
        this._fileSystemHandleWithDirectory = fileSystemHandle;
    }

    async scanFileMetadata() {
        this._file = await this._fileSystemHandleWithDirectory.fileHandle.getFile();
        this._name = this._file.name;
        this._lastModified = new Date(this._file.lastModified);
        this._exifTags = new ImageExifData(await ExifReader.load(this._file, { expanded: true }));
        this._sha256 = await this.calculateSha256();
    }

    getDataUrl() {
        if (!this._file) {
            throw new Error('File not loaded');
        }
        return URL.createObjectURL(this._file);
    }
}

export async function sha26ForFile(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export class ImageWithProgress {
    img: Image;
    decisionType: DecisionType;
    progress: ProgressType = ProgressType.Pending;
    error: string | undefined;

    setError(error: string) {
        this.error = error;
        this.progress = ProgressType.Error;
    }

    constructor(img: Image, decisionType: DecisionType) {
        this.img = img;
        this.decisionType = decisionType;
    }
}

export enum ProgressType {
    Pending,
    Completed,
    AlreadyExisted,
    Error
}

export class ImageExifData {
    make: string | undefined;
    model: string | undefined;
    exposureTime: string | undefined;
    fNumber: string | undefined;
    iso: string | undefined;
    focalLength: string | undefined;
    lensModel: string | undefined;
    latitude: string | undefined;
    longitude: string | undefined;
    width: number | undefined;
    height: number | undefined;

    constructor(tags: ExifReader.ExpandedTags) {
        this.make = tags.exif?.["Make"]?.description;
        this.model = tags.exif?.["Model"]?.description;
        this.exposureTime = tags.exif?.["ExposureTime"]?.description;
        this.fNumber = tags.exif?.["FNumber"]?.description;
        this.iso = tags.exif?.["ISOSpeedRatings"]?.description;
        this.focalLength = tags.exif?.["FocalLength"]?.description;
        this.lensModel = tags.exif?.["LensModel"]?.description;
        this.latitude = tags.gps?.Latitude?.toString();
        this.longitude = tags.gps?.Longitude?.toString();
        this.width = tags.file?.['Image Width']?.value;
        this.height = tags.file?.['Image Height']?.value;
    }
}
