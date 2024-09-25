import { useImageContext } from "@/context/images_context";
import { FileCheck, FileClock } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Separator } from "./ui/separator";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Button } from "./ui/button";
import { FlexLine } from "@/views/Save";


export default function TopInfoBar() {
    const { progressStats } = useImageContext();

    return (
        <div className="flex flex-row justify-end gap-2 items-center">
            <HoverCard>
                <HoverCardTrigger><div className="flex flex-row"><FileCheck /> {progressStats.progressed}/{progressStats.total}</div></HoverCardTrigger>
                <HoverCardContent>
                    <div className="flex flex-row">Completed {progressStats.progressed} images out of {progressStats.total} total.</div>
                    <Separator orientation="horizontal" />
                    <FlexLine>
                        <span>Accepted Images</span>
                        <span>{progressStats.accepted}</span>
                    </FlexLine>
                    <FlexLine>
                        <span>Rejected Images</span>
                        <span>{progressStats.rejected}</span>
                    </FlexLine>
                    <Separator orientation="horizontal" />
                    <FlexLine>
                        <span>Loaded Accepted Images</span>
                        <span>{progressStats.loadedAccepted}</span>
                    </FlexLine>
                    <FlexLine>
                        <span>Loaded Rejeceted Images</span>
                        <span>{progressStats.loadedRejected}</span>
                    </FlexLine>
                </HoverCardContent>
            </HoverCard>
            <HoverCard>
                <HoverCardTrigger><div className="flex flex-row"><FileClock /> {progressStats.remaining}</div></HoverCardTrigger>
                <HoverCardContent>
                    <div className="flex flex-row">{progressStats.remaining} images remaining.</div>
                </HoverCardContent>
            </HoverCard>
            <Button variant="outline">
                <NavLink to="/save" >Finish </NavLink>
            </Button>
        </div>
    );
}