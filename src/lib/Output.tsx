import DecisionType from "./DecisionType";
import Image, { ProgressType, sha26ForFile } from "./Image";

export default class Output {
    private _outputDir: FileSystemDirectoryHandle;
    private _images: Image[] = [];

    constructor(outputDir: FileSystemDirectoryHandle, images: Image[]) {
        this._outputDir = outputDir;
        this._images = images;
    }

    async writeToOutput(decisionList: { [key: string]: DecisionType }, keepFolders: boolean, onProgress?: (key: string, progressType: ProgressType, error: string | undefined) => void) {
        console.debug('Writing to output:', this._outputDir, this._images);
        for (const img of this._images) {
            if (img.sha256 !== undefined && decisionList[img.sha256] === DecisionType.Accept) {
                console.debug('Writing file:', img, img.directories);
                let currentDirHandle
                if (keepFolders) {
                    currentDirHandle = await createFolderIfNotExist(this._outputDir, img.directories);
                } else {
                    currentDirHandle = this._outputDir;
                }

                let fileHandle;
                try {
                    // Try to get the file handle, if it exists
                    fileHandle = await currentDirHandle.getFileHandle(img.name);

                    //read file content and skip on same sha256
                    const file = await fileHandle.getFile();
                    const targetSha256 = await sha26ForFile(file);
                    if (targetSha256 === img.sha256) {
                        console.debug('Skipping file with same sha256:', img.name);
                        onProgress?.(img.sha256, ProgressType.AlreadyExisted, undefined);
                        continue;
                    }

                } catch {
                    // File does not exist, create a new one
                    fileHandle = await currentDirHandle.getFileHandle(img.name, { create: true });
                }
                try {

                    const writable = await fileHandle.createWritable();
                    await writable.write(await img.arrayBuffer);
                    await writable.close();
                    console.debug('Wrote file:', img.name);
                    onProgress?.(img.sha256, ProgressType.Completed, undefined);
                } catch (e: any) {
                    console.error('Error writing file:', img.name, e);
                    onProgress?.(img.sha256, ProgressType.Error, e);
                }
            }
        }
    }
}


async function createFolderIfNotExist(dirHandle: FileSystemDirectoryHandle, directories: string[]) {
    console.debug('Creating folders:', directories);
    if (directories === undefined || directories.length === 0) {
        return dirHandle;
    }
    const folderName = directories.shift();
    if (folderName === undefined) {
        //should not happen
        return dirHandle;
    }
    console.debug('Creating folder:', folderName, directories);


    let currentDirHandle
    try {
        currentDirHandle = await dirHandle.getDirectoryHandle(folderName, { create: false });
    } catch {
        currentDirHandle = await dirHandle.getDirectoryHandle(folderName, { create: true });
    }
    return createFolderIfNotExist(currentDirHandle, directories);
}