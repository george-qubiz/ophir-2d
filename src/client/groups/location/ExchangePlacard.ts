import Konva from 'konva';
import { DynamicGroupInterface, ExchangeUpdate, GroupLayoutData } from '../../client_types';
import clientConstants from '../../client_constants';
import { HexId } from '../../../shared_types';
import { ExchangeCard } from './ExchangeCard';

const { COLOR } = clientConstants;

export class ExchangePlacard implements DynamicGroupInterface<ExchangeUpdate> {

    private group: Konva.Group;
    private background: Konva.Rect;
    private exchangeLocation: HexId;
    private goldForFavorCard: ExchangeCard;
    private silverForFavorCard: ExchangeCard;
    private goldForCoinsCard: ExchangeCard;
    private silverForCoinsCard: ExchangeCard;

    constructor(
        stage: Konva.Stage,
        location: HexId,
        layout: GroupLayoutData,
        update: ExchangeUpdate,
    ) {
        this.exchangeLocation = location;

        this.group = new Konva.Group({
            width: layout.width,
            height: layout.height,
            x: layout.x,
            y: layout.y,
        });

        this.background = new Konva.Rect({
            width: this.group.width(),
            height: this.group.height(),
            fill: COLOR.exchangeDarkGold,
            cornerRadius: 15,
            visible: false,
        });

        const playerAmounts = update.localPlayer && {
            coins: update.localPlayer.coins,
            favor: update.localPlayer.favor,
        }

        const leftmargin = 10;
        const cardWidth = 66;

        this.goldForFavorCard = new ExchangeCard(
            stage,
            { x: 0, y: 0 },
            {
                playerAmounts,
                exchange: {
                    currency: 'favor',
                    amount: 5,
                    metal: 'gold',
                }
            }
        );

        this.silverForFavorCard = new ExchangeCard(
            stage,
            { x: cardWidth + leftmargin, y: 0 },
            {
                playerAmounts,
                exchange: {
                    currency: 'favor',
                    amount: 3,
                    metal: 'silver',
                }
            }
        );

        this.goldForCoinsCard = new ExchangeCard(
            stage,
            { x: cardWidth * 2 + leftmargin * 2, y: 0 },
            {
                playerAmounts,
                exchange: {
                    currency: 'coins',
                    amount: update.templeLevel.goldCost,
                    metal: 'gold',
                }
            }
        );

        this.silverForCoinsCard = new ExchangeCard(
            stage,
            { x: cardWidth * 3 + leftmargin * 3, y: 0 },
            {
                playerAmounts,
                exchange: {
                    currency: 'coins',
                    amount: update.templeLevel.silverCost,
                    metal: 'silver',
                }
            }
        );

        this.group.add(...[
            this.background,
            this.goldForFavorCard.getElement(),
            this.silverForFavorCard.getElement(),
            this.goldForCoinsCard.getElement(),
            this.silverForCoinsCard.getElement(),
        ]);
    }

    public updateElement(update: ExchangeUpdate): void {
        if (update.localPlayer?.hexagon.hexId === this.exchangeLocation) {
            this.background.fill(COLOR.exchangeGold);
        } else {
            this.background.fill(COLOR.exchangeDarkGold);
        }

        const playerAmounts = update.localPlayer && {
            coins: update.localPlayer.coins,
            favor: update.localPlayer.favor,
        }
        this.goldForFavorCard.updateElement({
            playerAmounts,
            exchange: {
                currency: 'favor',
                amount: 5,
                metal: 'gold',
            }
        });
    }

    public getElement(): Konva.Group {
        return this.group;
    }
}