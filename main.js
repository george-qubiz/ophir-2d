import constants from './constants.json';
import { CommunicationService } from './services/commService.js';
import { MapBoardService } from './services/mapBoardService.js';
import { EventHandler } from './eventHandler.js';

const { CONNECTION } = constants;

new EventHandler(); // Enables inter-class communication

const commService = CommunicationService.getInstance();
commService.createConnection(CONNECTION.wsAddress);

const mapBoardService = MapBoardService.getInstance();
mapBoardService.initiateCanvas();

