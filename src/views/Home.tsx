import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useImageContext } from "@/context/images_context";
import { csvToDecisions } from "@/lib/DecisionsCsv";
import ImageWalker from "@/lib/ImageWalker";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    const { setImages, setDecisions } = useImageContext();
    const [isBrowserCompatible, setIsBrowserCompatible] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState<CheckedState>('indeterminate');
    const [loading, setLoading] = useState(false);
    const [loadedChoicesAmount, setLoadedChoicesAmount] = useState(0);

    const imageWalkerRef = useRef<ImageWalker | null>(null);


    const checkBrowser = () => {
        if ('showDirectoryPicker' in window) {
            setIsBrowserCompatible(true);
        }
    }

    const clickHandler = async () => {
        const imageWalker = imageWalkerRef.current;
        if (imageWalker) {
            const dirHandle = await (window as any).showDirectoryPicker();
            setLoading(true);
            await imageWalker.scan(dirHandle);
            setDecisions(imageWalker.getLoadedChoiceListForImages());
            setImages(imageWalker.images);
            navigate('/review');
        }
    }

    const loadSavedChoicesFileHandler = async () => {
        const imageWalker = imageWalkerRef.current;

        if (imageWalker) {
            const fileHandle = await (window as any).showOpenFilePicker({ multiple: true, types: [{ accept: { 'text/csv': ['.csv'] } }] });
            for (const handle of fileHandle) {

                const file = await handle.getFile();
                if (!file.type.match('text/csv')) {
                    throw new Error('File is not a CSV file');
                }
                const fileContents = await file.text();
                const choices = csvToDecisions(fileContents);
                imageWalker.addLoadedChoice(choices);
            }
            setLoadedChoicesAmount(Object.keys(imageWalker.loadedChoices).length);
        }
    }

    useEffect(() => {
        if (imageWalkerRef.current === null) {
            imageWalkerRef.current = new ImageWalker();
        }
        checkBrowser();
        return () => {
            setIsBrowserCompatible(false);
            setAgreeToTerms(false)
            setLoading(false);
            imageWalkerRef.current = null;
        }
    }, []);

    return (
        <div className="mx-auto max-w-[1200px] h-full flex flex-col gap-2 justify-between" >
            <div className="flex flex-col gap-2">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Photo Sort
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This application helps to sort through old pictures and quickly select only photos to keep.</p>
                        <p>Everything is done on this browser, your photos are NOT sent to any server and remain on your device.</p>
                        <p>You start by selecting a folder containing the images. Then you can go through all picutres and accept (keyboard shortcut 'p') or reject (keyboard shortcut x). After finishing, all accepted pictures will be copied to a new folder. The original files will not be deleted or modified. The author of this app still advices to make a copy (backup) of your data before proceeding.</p>
                    </CardContent>
                </Card>
                {isBrowserCompatible &&
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                1) Agree to terms of use
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="items-top flex space-x-2 mt-4">
                                <Checkbox id="keep-folders" checked={agreeToTerms} onCheckedChange={setAgreeToTerms} />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="keep-folders"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I agree to the terms and conditions of this application: Use at own risk, the author of this app is not responsible for any data loss or damage to your files. You are responsible to create a backup of your data before proceeding.
                                    </label>

                                </div>
                            </div>
                        </CardContent>
                    </Card>
                }
                {isBrowserCompatible &&
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                2) (Optional) Load saved choices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>If you have saved your choices from a previous session, you can load them here.</p>
                            {loadedChoicesAmount > 0 && <p>Loaded {loadedChoicesAmount} choices</p>}
                        </CardContent>
                        <CardFooter>
                            <Button disabled={agreeToTerms !== true} onClick={loadSavedChoicesFileHandler} className="w-full">Load saved choices</Button>
                        </CardFooter>
                    </Card>
                }
                {isBrowserCompatible &&
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                3) Select Photos Folder to scan for images to sort
                            </CardTitle>
                        </CardHeader>
                        <CardFooter>
                            {loading ?
                                <div>
                                    <div className="loader"></div>
                                    <p>Loading images from folder...</p>
                                </div>
                                : <Button disabled={agreeToTerms !== true} onClick={clickHandler} className="w-full">Select Photos Folder</Button>
                            }
                        </CardFooter>
                    </Card>
                }
                {!isBrowserCompatible &&
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Browser not compatible
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-red-500">Your browser is not compatible with this application. Please use a browser that supports the File System Access API, e.g. Google Chrome Browser on a PC.</p>
                        </CardContent>
                    </Card>
                }
            </div>
            <div className="flex flex-row gap-2 justify-center">
                <p>Open-Source on <a href="https://github.com/enrico-kaack/photo-sort">GitHub</a></p>
                <Separator orientation="vertical" />
                <NavLink to="/impressum">Impressum</NavLink>
            </div>
        </div>
    );
}