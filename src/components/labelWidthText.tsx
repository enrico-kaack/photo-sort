import { Label } from "./ui/label";

export default function LabelWidthText({ label, text }: { label: string, text: string }) {
    const id = label.toLowerCase().replace(' ', '_');
    if (text == "") {
        text = "undefined";
    }
    return (
        <div>
            <Label htmlFor={id}>{label}</Label>
            <div className="truncate" id={id}>{text}</div>
        </div>
    );
}