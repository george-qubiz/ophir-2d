import { HexId, PlayerId, SharedState, Coordinates, Action, ActionDetails, LocationId, ItemId, NewState, Trade, MarketOffer, Player, MetalId, MetalPrices, Currency, TempleStatus } from '../shared_types';
import Konva from 'konva';

export type Color = `#${string}`;
export type HexOffset = { id: HexId, x: number, y: number };
export type LocationIconData = { shape: string, fill: Color };
export type TempleIconData = { shapeId: number, icon: LocationIconData };
export type PathData = { shape: string, fill: Color };
export type IslandData = { x: number, y: number, shape: string };
export type EventTitle = "connected" | "action" | "update" | "error" | "info" | "setup";
export type LocalState = {
    playerId: PlayerId | null,
    playerName: string | null,
    isBoardDrawn: boolean,
}
export type ClientState = {
    local: LocalState,
    received: SharedState | NewState,
}

export type ClientConstants = {
    CONNECTION: {
        wsAddress: string
    },
    DEFAULT_LOCAL_STATE: LocalState,
    COLOR: Record<string, Color>,
    COLOR_PROFILES: Record<string, ColorProfile>,
    HEX_OFFSET_DATA: Array<HexOffset>,
    ISLAND_DATA: Record<HexId, IslandData>,
    LOCATION_TOKEN_DATA: Record<LocationId, LocationIconData>,
    TEMPLE_CONSTRUCTION_DATA: Array<TempleIconData>
    SHIP_DATA: {
        setupDrifts: Array<Coordinates>,
        shape: string
    },
    CARGO_ITEM_DATA: Record<ItemId, PathData>,
    ICON_DATA: Record<string, PathData>,
}

export interface MegaGroupInterface {
    drawElements(): void,
    updateElements(): void,
}

export interface DynamicGroupInterface<S> {
    getElement(): Konva.Group,
    updateElement(state: S): void,
}

export interface StaticGroupInterface {
    getElement(): Konva.Group,
}

export type GroupLayoutData = {
    width: number,
    height: number,
    x: number,
    y: number,
};

export type ColorProfile = {
    primary: Color,
    secondary: Color,
    tertiary: Color | null,
}

export type MarketCardUpdate = {
    trade: Trade,
    isFeasible: boolean,
}

export type MarketUpdate = {
    localPlayer: Player | null,
    marketOffer: MarketOffer,
}

export type TreasuryUpdate = {
    localPlayer: Player | null,
    metalPrices: MetalPrices,
}

export type TreasuryCardUpdate = {
    playerAmounts: { coins: number, favor: number } | null,
    treasury: { currency: Currency, amount: number, metal: MetalId },
}

export type TempleUpdate = {
    trade: Trade,
    templeStatus: TempleStatus,
    localPlayer: Player | null,
}

export type EventPayload = InfoEventPayload | ActionEventPayload | ErrorEventPayload | SetupEventPayload | null;

export type InfoEventPayload = {
    text: string,
}

export type ErrorEventPayload = {
    error: string,
}

export type ActionEventPayload = {
    action: Action,
    details: ActionDetails,
}

export type SetupEventPayload = {
    playerPositions: Array<Coordinates>,
}
