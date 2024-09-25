import DecisionType from "./DecisionType";
import Image from "./Image";


export default class ImageWalker {
    private _files: FileHandleWithDirectory[];
    private _images: Image[] = [];

    private _loadedChoices: { [key: string]: DecisionType } = {};

    constructor() {
        this._files = [];
    }

    get images() {
        return this._images;
    }

    get loadedChoices() {
        return this._loadedChoices;
    }

    // Recursively walk through the directory and get all files
    async walk(dirHandle: FileSystemDirectoryHandle, rootFolders: string[] = []) {
        console.debug('Scanning directory:', dirHandle, rootFolders);
        for await (const entry of (dirHandle as any).values()) {
            if (entry.kind === 'file') {
                this._files.push(new FileHandleWithDirectory(entry, [...rootFolders]));
            } else if (entry.kind === 'directory') {
                console.debug('Found directory:', entry);
                const rootFoldersCopy = [...rootFolders, entry.name];
                await this.walk(entry, rootFoldersCopy);
            }
        }
    }

    async scan(dirHandle: FileSystemDirectoryHandle) {
        await this.walk(dirHandle);
        console.debug('Files found:', this._files.length, this._files);
        await this.filterForImages();
        console.debug('Images found:', this._files.length, this._files);

        this._images = this._files.map(file => new Image(file));
        await Promise.all(this._images.map(async image => {
            await image.scanFileMetadata();
        }));
        console.debug('Images:', this._images);
    }

    addLoadedChoice(loadedChoices: { [key: string]: DecisionType }) {
        //merge loaded choices with existing choices
        this._loadedChoices = { ...this._loadedChoices, ...loadedChoices };
    }

    getLoadedChoiceListForImages(): { [key: string]: DecisionType } {
        return this._images.filter(image => this._loadedChoices[image.sha256] !== undefined).map(image => {
            return { [image.sha256]: this._loadedChoices[image.sha256] };
        }).reduce((acc, val) => {
            return { ...acc, ...val };
        }, {});
    }

    private async filterForImages() {
        this._files = this._files.filter(file => file.fileHandle.name.match(/\.(jpg|jpeg|png|gif)$/i));
    }

}

export class FileHandleWithDirectory {
    fileHandle: FileSystemFileHandle;
    directory: string[] = [];

    constructor(fileHandle: FileSystemFileHandle, directory: string[]) {
        this.fileHandle = fileHandle;
        this.directory = directory;
    }
}