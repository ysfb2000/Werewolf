import { PowerType } from "../enums";

export class PowerItem {
    Power: PowerType;
    IsUsed: boolean = false;

    constructor(power: PowerType) {
        this.Power = power;
    }
}