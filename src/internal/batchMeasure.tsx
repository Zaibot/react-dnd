import { IBounds } from "../utils";
import { getElementBoundsOrEmpty } from "./getElementBounds";
import ReactDOM from "react-dom";

export class BatchMeasure {
    private queue: { component: React.Component<any>, element: HTMLElement, callback: (bounds: IBounds) => void }[] = [];
    private timer: any = null;
    private countdown = 10;

    public push(component: React.Component<any>, element: HTMLElement, callback: (bounds: IBounds) => void) {
        this.queue = this.queue.filter((e) => e.component !== component).concat({ component, element, callback });
        if (!this.timer) {
            this.timer = window.requestAnimationFrame(this.trigger);
        }
    }

    private trigger = () => {
        if (--this.countdown <= 0) {
            this.countdown = 10;
            this.timer = null;
            const queue = this.queue;
            this.queue = [];
            // ReactDOM.unstable_batchedUpdates(() => {
            //     queue.map(({ element, callback }) => ({
            //         callback,
            //         bounds: getElementBoundsOrEmpty(element),
            //     })).forEach(({ callback, bounds }) => (
            //         callback(bounds)
            //     ));
            // });
        } else {
            this.timer = window.requestAnimationFrame(this.trigger);
        }
    }
}

export const defaultBatchMeasure = new BatchMeasure();
