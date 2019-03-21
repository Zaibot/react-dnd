import { Interaction } from "./interaction";
import { EventEmitter } from "events";
import { distanceInteraction } from "./interaction";

const threshold = 10;

export interface DragTarget {
    readonly interaction: Interaction;
    readonly accepted?: { meta: any };
    readonly declined?: { meta: any };
}

export class DragSession extends EventEmitter {
    private _completed: boolean = false;
    private _data: any;
    private _origin: Interaction;
    private _current?: Interaction;
    private _target?: DragTarget;

    constructor(data: any, origin: Interaction) {
        super();
        this._data = data;
        this._origin = origin;
    }

    get data() { return this._data; }
    get origin() { return this._origin; }
    get current() { return this._current; }
    get target() { return this._target; }

    public abort() {
        if (this._completed) { return; }
        this._completed = true;
        // console.log(`abort`);
        this.emit(`abort`);
        this.emit(`free`);
    }

    public move(interaction: Interaction) {
        if (this._completed) { return; }
        // console.log(`move`);
        const data = this._data;
        const target = this._target;
        if (this._current || (distanceInteraction(this._origin, interaction)) > threshold) {
            this._current = interaction;
            this.emit(`move`, { data, interaction, target });
        }
    }

    public accept(meta: any, interaction: Interaction) {
        if (this._completed) { return; }
        // console.log(`accept`);
        const data = this._data;
        this._target = { interaction, accepted: { meta } };
        this.emit(`accept`, { data, meta, interaction });
    }

    public decline(meta: any, interaction: Interaction) {
        if (this._completed) { return; }
        // console.log(`decline`);
        const data = this._data;
        this._target = { interaction, declined: { meta } };
        this.emit(`decline`, { data, meta, interaction });
    }

    public outside() {
        if (this._completed) { return; }
        // console.log(`outside`);
        this._target = undefined;
        this.emit(`outside`);
    }

    public release(interaction: Interaction) {
        if (this._completed) { return; }
        this._completed = true;
        // console.log(`release`);
        const data = this._data;
        const target = this._target;
        this.emit(`release`, { data, interaction, target });
        this.emit(`free`);
    }
}

export interface DragSession {
    on(event: `free`, listener: () => void): this;
    on(event: `abort`, listener: () => void): this;
    on(event: `move`, listener: (args: { data: any, interaction: Interaction, target?: DragTarget }) => void): this;
    on(event: `accept`, listener: (args: { data: any, meta: any, interaction: Interaction }) => void): this;
    on(event: `decline`, listener: (args: { data: any, meta: any, interaction: Interaction }) => void): this;
    on(event: `outside`, listener: () => void): this;
    on(event: `release`, listener: (args: { data: any, interaction: Interaction, target?: DragTarget }) => void): this;
}
