import { IBounds } from "../utils";
import { getElementBoundsOrEmpty } from "./getElementBounds";
import ReactDOM from "react-dom";

const framesPerUpdate = 20;
export class BatchMeasure {
    private queue: { component: React.Component<any>, element: HTMLElement, callback: (bounds: IBounds) => void }[] = [];
    private timer: any = null;
    private countdown = framesPerUpdate;

    public push(component: React.Component<any>, element: HTMLElement, callback: (bounds: IBounds) => void) {
        this.queue = this.queue.filter((e) => e.component !== component).concat({ component, element, callback });
        if (!this.timer) {
            this.timer = window.requestAnimationFrame(this.trigger);
        }
    }

    public remove(component: React.Component<any>) {
        this.queue = this.queue.filter((e) => e.component !== component);
    }

    private trigger = () => {
        if (--this.countdown <= 0) {
            this.countdown = framesPerUpdate;
            this.timer = null;
            const queue = this.queue;
            this.queue = [];
            const measured = queue.map(({ element, callback }) => ({
                callback,
                bounds: getElementBoundsOrEmpty(element),
            }));
            ReactDOM.unstable_batchedUpdates(() => {
                measured.forEach(({ callback, bounds }) => callback(bounds));
            });
        } else {
            this.timer = window.requestAnimationFrame(this.trigger);
        }
    }
}

export const defaultBatchMeasure = new BatchMeasure();
