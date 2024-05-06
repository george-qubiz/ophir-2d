import Konva from 'konva';
import { ActionEventPayload, PlayerShipInterface } from '../../shared_types';
import state from '../state';
import sharedConstants from '../../shared_constants';
import { Ship } from './ship';
const { COLOR, HEX_COUNT, EVENT, ACTION } = sharedConstants;

export class PlayerShip implements PlayerShipInterface {

    ship: Konva.Rect;

    public switchControl = (isActivePlayer: boolean) => {
        this.ship.draggable(isActivePlayer);
    }

    public getElement = () => this.ship;

    constructor (
        stage: Konva.Stage,
        layer: Konva.Layer,
        offsetX: number,
        offsetY: number,
        fill: string
    ) {
        this.ship = new Ship(
            offsetX,
            offsetY,
            fill,
            state.localPlayerId,
            true
        ).getElement();

        this.ship.on('dragstart', () => {
            state.konva.localShip.homePosition = { x: this.ship.x(), y: this.ship.y() }
        });

        this.ship.on('dragmove', () => {

            const player = state.server.players[state.localPlayerId];
            const targetHex = state.konva.hexes.find(hex => hex.intersects(stage.getPointerPosition()));
            const shipState = state.konva.localShip;

            for (let i = 0; i < HEX_COUNT; i++) {
                state.konva.hexes[i].fill(COLOR.default);
            }

            shipState.isDestinationValid = false;

            if (!targetHex) {
                return;
            }

            if (targetHex.attrs.id === player.location.hexId) {
                targetHex.fill(player.isAnchored ? COLOR.anchored : COLOR.illegal);

            } else if (player.allowedMoves.includes(targetHex.attrs.id)) {
                targetHex.fill(COLOR.valid);
                shipState.isDestinationValid = true;

            } else {
                targetHex.fill(COLOR.illegal);
            }
        });

        this.ship.on('dragend', () => {

            const targetHex = state.konva.hexes.find(hex => hex.intersects(stage.getPointerPosition()));
            const { x: positionX, y: positionY } = state.konva.localShip.homePosition;
            const player = state.server.players[state.localPlayerId];

            for (let i = 0; i < HEX_COUNT; i++) {
                state.konva.hexes[i].fill(COLOR.default);
            }

            if (state.konva.localShip.isDestinationValid) {
                targetHex.fill(COLOR.anchored);
                this.broadcastAction({
                    action: ACTION.move,
                    details: {
                        hexId: targetHex.attrs.id,
                        position: { x: this.ship.x(), y: this.ship.y() }
                    }
                });
            } else {
                this.ship.x(positionX);
                this.ship.y(positionY);
                const locationHex = state.konva.hexes.find(hex => hex.attrs.id === player.location.hexId);
                locationHex.fill(player.isAnchored ? COLOR.anchored : COLOR.illegal);
            }

            layer.batchDraw();
        });
    }

    private broadcastAction = (detail: ActionEventPayload = null) => {
        window.dispatchEvent(new CustomEvent(
            EVENT.action,
            { detail: detail }
        ));
    }
}