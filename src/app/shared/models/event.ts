import { EventCodeType } from "../enums";



export class GameEvent {
    eventType: EventCodeType;
    message: string = '';

    constructor(eventType: EventCodeType, message: string) {
        this.eventType = eventType;
        this.message = message;
    }
}