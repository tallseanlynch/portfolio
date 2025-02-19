type ClientDataStatus = string;

interface ClientData {
    uuid: string;
    status: ClientDataStatus;
    memory: {[key: string]: any}
}

interface EventData {
    uuid: string;
    timeStamp: number;
    messageType: string;
    payload: {[key: string]: any};
}

type UpdateClientDataWebSocketMessagePayload = string | null;

interface WebSocketServerMemory {
    [key: string]: any;
}

export type {
    ClientData,
    EventData,
    UpdateClientDataWebSocketMessagePayload,
    WebSocketServerMemory,
    ClientDataStatus
}