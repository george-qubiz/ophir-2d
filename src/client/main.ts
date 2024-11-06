import { InfoEventPayload, ActionEventPayload, ErrorEventPayload, SetupEventPayload } from "./client_types";
import state from "./state";
import { CommunicationService, CommunicationInterface } from "./services/CommService";
import { CanvasService, CanvasInterface } from "./services/CanvasService";
import { UserInterfaceService, UiInterface } from "./services/UiService";
import sharedConstants from "../shared_constants";
import clientConstants from "./client_constants";
import { SharedState } from "../shared_types";
const { ACTION, STATUS, CONNECTION } = sharedConstants;
const { EVENT } = clientConstants;

// Initializations
const commService: CommunicationInterface = CommunicationService.getInstance([CONNECTION.wsAddress]);
const canvasService: CanvasInterface = CanvasService.getInstance([]);
const uiService: UiInterface = UserInterfaceService.getInstance([]);

// window.addEventListener(
//     EVENT.setup as any,
//     (event) => {
//         const payload: SetupEventPayload = event.detail;
//         commService.sendMessage(
//             payload.playerPositions
//         )
//     },
// );
//Send player action to server
window.addEventListener(
    EVENT.action as any,
    (event) => {
        const payload: ActionEventPayload = event.detail;
        commService.sendMessage(
            payload.action,
            payload.details
        )
    },
);

//Display errors
window.addEventListener(
    EVENT.error as any,
    (event) => {
        const payload: ErrorEventPayload = event.detail;
        console.error(payload.error);
        alert(payload.error);
    },
);

// Get server data on connection
window.addEventListener(
    EVENT.connected,
    () => commService.sendMessage(ACTION.inquire),
);

// Update client on server state update
window.addEventListener(EVENT.update, () => {
    const serverState = state.server as SharedState;
    if (serverState.gameStatus === STATUS.started) {
        if (state.isBoardDrawn) {
            canvasService.updateElements();
        } else {
            uiService.setInfo('The game has started');
            canvasService.drawElements();
            state.isBoardDrawn = true;
        }
        uiService.updateGameControls();
    } else {
        uiService.updateLobbyControls();
    }
});

window.addEventListener(
    EVENT.info as any,
    (event) => {
        const payload: InfoEventPayload = event.detail;
        uiService.setInfo(payload.text)
    }
);

commService.createConnection();
