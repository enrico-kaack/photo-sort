export class ProgresStats {
    total: number;
    accepted: number;
    rejected: number;
    loadedAccepted: number;
    loadedRejected: number;

    get remaining() {
        return this.total - this.accepted - this.rejected - this.loaded;
    }

    get progressed() {
        return this.accepted + this.rejected + this.loaded;
    }

    get loaded() {
        return this.loadedAccepted + this.loadedRejected;
    }

    constructor(total: number, accepted: number, rejected: number, loadedAccepted: number, loadedRejected: number) {
        this.total = total;
        this.accepted = accepted;
        this.rejected = rejected;
        this.loadedAccepted = loadedAccepted;
        this.loadedRejected = loadedRejected;
    }

}