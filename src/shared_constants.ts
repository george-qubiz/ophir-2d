import { SharedConstants } from "./shared_types";

const sharedConstants: SharedConstants = {
    CONNECTION: {
        wsAddress: "ws://localhost:8080"
    },
    STATUS: {
        empty: "empty",
        created: "created",
        full: "full",
        started: "started"
    },
    ACTION: {
        inquire: "inquire",
        enroll: "enroll",
        start: "start",
        move: "move",
        favor: "favor",
        refresh: "refresh",
        turn: "turn",
        pickup_good: "pickup_good",
        visit_temple: "visit_temple",
        sell_goods: "sell_goods",
        buy_metals: "buy_metals",
    },
}

export default sharedConstants;