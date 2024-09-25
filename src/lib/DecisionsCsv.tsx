import DecisionType from "./DecisionType";

export type Decisions = { [key: string]: DecisionType }

export function decisionsToCsv(choices: Decisions): string {
    let csv = 'sha256,decision\n';
    for (const [sha256, decision] of Object.entries(choices)) {
        if (decision === DecisionType.LoadedAccepted || decision === DecisionType.LoadedRejected) {
            continue;
        }
        csv += `${sha256},${decision}\n`;
    }
    return csv;
}

export function csvToDecisions(csv: string): Decisions {
    const lines = csv.split('\n');
    const header = lines[0].split(',');

    if (header[0] !== 'sha256' || header[1] !== 'decision') {
        throw new Error('Invalid CSV header');
    }

    const choices: Record<string, DecisionType> = {};
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const values = line.split(',');
            const key = values[0];
            const decision = values[1] as DecisionType;
            if (key && decision === DecisionType.Accept) {
                choices[key] = DecisionType.LoadedAccepted;
            } else if (key && decision === DecisionType.Reject) {
                choices[key] = DecisionType.LoadedRejected;
            }
        }
    }
    console.debug('Loaded choices:', choices);
    return choices;
}