import { PlayerId, ActionEventPayload } from '../../shared_types.js';
import { Service, ServiceInterface } from './service';
import state from '../state';
import constants from '../../constants';
import { Button } from '../html_components/button';

export interface UiInterface extends ServiceInterface {
    setInfo: (text: string) => void,
    updatePreSessionUi: () => void,
    disableAllElements: () => void,
}

const { ACTION, EVENT, STATUS } = constants;

export class UserInterfaceService extends Service implements UiInterface {

    createButton; joinButton; startButton; playerColorSelect;

    constructor() {
        super();
        this.createButton = new Button('createButton', this.processEnroll);
        this.joinButton = new Button('joinButton', this.processEnroll);
        this.startButton = new Button('startButton', this.processStart);
        this.playerColorSelect = {
            element: document.getElementById('playerColorSelect') as HTMLSelectElement,
            enable: () => {
                this.playerColorSelect.element.disabled = false;
                const players = state.server.players
                Array.from(this.playerColorSelect.element.options).forEach(option => {
                    switch (true) {
                        case players && (option.value in players):
                        case option.value === '': option.disabled = true; break;
                        default: option.disabled = false; break
                    }
                });
            },

            disable: () => this.playerColorSelect.element.disabled = true,
        }
    }

    private processStart = (): void => {
        this.startButton.disable();
        const payload: ActionEventPayload = {action: ACTION.start, details: null};

        return this.broadcastEvent(EVENT.action, payload);
    }

    private processEnroll = (): void => {
        const selectedId = this.playerColorSelect.element.value as PlayerId;

        if (!selectedId) {
            return this.setInfo('Please select a color');
        }

        if (state.server.availableSlots.includes(selectedId)) {
            state.localPlayerId = selectedId as PlayerId;
            const payload: ActionEventPayload = {action: ACTION.enroll, details: null};

            return this.broadcastEvent(EVENT.action, payload);
        }

        return this.setInfo('This color has just been taken :(');
    }

    public setInfo (text: string): void {
        const info = document.getElementById('info');
        info.innerHTML = text;
    }

    private enableElements (...handlers: { enable:()=>void }[]): void {
        handlers.forEach(handler => handler.enable());
    }

    public disableAllElements = (): void => {
        this.createButton.disable();
        this.joinButton.disable();
        this.startButton.disable();
        this.playerColorSelect.disable();
    }

    public updatePreSessionUi = (): void => {
        this.disableAllElements();

        switch (state.server.status) {
            case STATUS.empty: this.enableCreate(); break;
            case STATUS.created: this.enableJoinOrStart(); break;
            case STATUS.full: this.enableStartForOwner(); break;
        }
    }

    private enableJoinOrStart = (): void => {

        if (!state.localPlayerId) {
            this.enableElements(this.joinButton, this.playerColorSelect);

            return this.setInfo('A game is waiting for you');
        }

        if (state.server.sessionOwner === state.localPlayerId) {
            this.startButton.enable();

            return this.setInfo('You may wait for more player or start');
        }

        return this.setInfo('Waiting for players to join...');
    }

    private enableCreate = (): void => {
        this.enableElements(this.createButton, this.playerColorSelect);

        return this.setInfo('You may create the game');
    }

    private enableStartForOwner = (): void => {

        if (!state.localPlayerId) {
            return this.setInfo('The game is full, sorry :(');
        }

        if (state.localPlayerId === state.server.sessionOwner) {
            this.startButton.enable();

            return this.setInfo('You may start whenever you want');
        }

        return this.setInfo('The game might start at any time.');
    }
}