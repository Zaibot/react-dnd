import ReactDOM from "react-dom";

export class SquashEvents {
    private queue: { event: { type: string; }, handle: () => void }[] = [];
    private timer: any = null;

    public push<T extends { type: string; }>(e: T, squash: (e: { type: string; }) => boolean, handle: (e: T) => void) {
        this.queue = this.queue.filter((e) => !squash(e.event)).concat({ event: e, handle: () => handle(e) });
        if (!this.timer) {
            this.timer = window.requestAnimationFrame(() => {
                this.timer = null;
                const queue = this.queue;
                this.queue = [];
                ReactDOM.unstable_batchedUpdates(() => {
                    queue.forEach((x) => x.handle());
                });
            });
        }
    }
}
