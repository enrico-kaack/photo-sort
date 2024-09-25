import H2Header from "@/components/h2Heading";
import IconWithBadge from "@/components/IconWithBadge";
import ImageWithProgressGridIcon from "@/components/imageWithProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useImageContext } from "@/context/images_context";
import { decisionsToCsv } from "@/lib/DecisionsCsv";
import DecisionType from "@/lib/DecisionType";
import { ImageWithProgress, ProgressType } from "@/lib/Image";
import Output from "@/lib/Output";
import { downloadFile } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Check, CopyCheck, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";


export default function SavePage() {
    const { images, decisions } = useImageContext();

    const [imagesWithProgress, setImagesWithProgress] = useState<{ [key: string]: ImageWithProgress }>({});
    const [phase, setPhase] = useState<Phase>(Phase.SelectOutputDir);
    const [keepFolders, setKeepFolders] = useState<CheckedState>(false);

    useEffect(() => {
        const imagesWithProgress: { [key: string]: ImageWithProgress } = {};
        images.forEach(img => {
            let decision = decisions[img.sha256];
            if (decision === undefined) {
                decision = DecisionType.Pending;
            }
            imagesWithProgress[img.sha256] = new ImageWithProgress(img, decisions[img.sha256]);
        });
        setImagesWithProgress(imagesWithProgress);

        return () => {
            setImagesWithProgress({});
            setPhase(Phase.SelectOutputDir);
            setKeepFolders(false);
        }

    }, [images, decisions]);

    const getCheckedState = () => {
        if (keepFolders === 'indeterminate') {
            return false;
        } else {
            return keepFolders;
        }
    }

    const clickHandler = async () => {
        const outDirHandle = await (window as any).showDirectoryPicker({ mode: "readwrite" });
        const output = new Output(outDirHandle, images);
        setPhase(Phase.WritingToOutput);
        await output.writeToOutput(decisions, getCheckedState(), (key, progressType, error) => {
            setImagesWithProgress((prev) => {
                const newImagesWithProgress = { ...prev };
                console.debug('Setting progress for:', key, progressType);
                if (progressType === ProgressType.Error) {
                    console.error('Error writing file:', key);
                    newImagesWithProgress[key].setError(error!)
                }
                newImagesWithProgress[key].progress = progressType;
                return newImagesWithProgress;
            });
        });
        setPhase(Phase.Completed);
    }

    const saveChoicesCsv = () => {
        const csv = decisionsToCsv(decisions);
        downloadFile('choices.csv', csv, 'text/csv');
    }

    const acceptedImages = Object.values(imagesWithProgress).filter((imgWithProgress) => imgWithProgress.decisionType === DecisionType.Accept);
    const imagesCompleted = Object.values(imagesWithProgress).filter((imgWithProgress) => imgWithProgress.progress === ProgressType.Completed);
    const iamgesSkipped = Object.values(imagesWithProgress).filter((imgWithProgress) => imgWithProgress.progress === ProgressType.AlreadyExisted);
    const imagesInError = Object.values(imagesWithProgress).filter((imgWithProgress) => imgWithProgress.progress === ProgressType.Error);

    const progress = Object.values(imagesWithProgress).filter((imgWithProgress) => imgWithProgress.progress !== ProgressType.Pending).length / acceptedImages.length * 100;

    let renderArea
    switch (phase) {
        case Phase.SelectOutputDir:
            renderArea = (
                <>
                    <Card>
                        <CardHeader><CardTitle>Save selected images</CardTitle></CardHeader>
                        <CardContent>
                            <p>Copy the selected images into a separate folder.
                                The original images will not be moved or deleted!
                                Selecting an empty folder is recommended.</p>


                            <div className="mt-4">
                                <div className="items-top flex space-x-2">
                                    <Checkbox id="keep-folders" checked={keepFolders} onCheckedChange={setKeepFolders} />
                                    <div className="grid gap-1.5 leading-none">
                                        <label
                                            htmlFor="keep-folders"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Keep original folder structure
                                        </label>
                                        <p className="text-sm text-muted-foreground">
                                            Selected images will be copied with the same folder structure as from the source.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Button onClick={clickHandler}>Select Output Directory</Button>
                </>
            )
            break;
        case Phase.WritingToOutput:
            renderArea = (
                <>
                    <H2Header>Writing...</H2Header>
                    <Progress value={progress} />
                    <div className="grid grid-cols-8 gap-2">
                        {acceptedImages.map((imgWithProgress) => {
                            return <ImageWithProgressGridIcon key={imgWithProgress.img.sha256} image={imgWithProgress} />
                        })}
                    </div>
                </>
            )
            break;
        case Phase.Completed:
            renderArea = (
                <>
                    <Card>
                        <CardHeader><CardTitle>Save completed</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-row justify-center gap-4">
                                <div className=" flex flex-col items-center">
                                    <IconWithBadge count={imagesCompleted.length} child={<Check />} />
                                    <p>Saved images</p>
                                </div>
                                <div className=" flex flex-col items-center">
                                    <IconWithBadge count={iamgesSkipped.length} child={<CopyCheck />} />
                                    <p>Skipped images</p>
                                </div>
                                <div className=" flex flex-col items-center">
                                    <IconWithBadge count={imagesInError.length} child={<ShieldAlert />} />
                                    <p>Failed images </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Save choices</CardTitle></CardHeader>
                        <CardContent>Store a .csv file containing the choice for all images. This can be loaded in the beginning in case you have to decide for the same images again (e.g. if they are duplicated).</CardContent>
                        <CardFooter><Button onClick={saveChoicesCsv}>Save choices.csv</Button></CardFooter>
                    </Card>
                    <Card className="p-6">
                        <div className="grid grid-cols-8 gap-2">
                            {acceptedImages.map((imgWithProgress) => {
                                return <ImageWithProgressGridIcon key={imgWithProgress.img.sha256} image={imgWithProgress} />
                            })}
                        </div>
                    </Card>

                </>
            )
            break;
    }


    return (
        <div className="mx-auto max-w-[1200px] grid grid-cols-1 gap-2" >
            {renderArea}
        </div>
    );
}

enum Phase {
    SelectOutputDir,
    WritingToOutput,
    Completed
}

export function FlexLine({ children }: { children: React.ReactNode }) {
    return <div className="flex flex-row justify-between">{children}</div>
}
