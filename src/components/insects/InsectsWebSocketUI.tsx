import {
    useState,
    useEffect,
    useRef
} from 'react';
import { ClientData, EventData } from './websocket-types';
import { InsectsControls } from './InsectsControls';
import { InsectsSocketInsect } from './InsectsSocketInsect';

const localhostAddress = 'ws://localhost:8080';
const gcpAddress = 'wss://websocket-service-943494934642.us-central1.run.app';
const wssAddress = window.location.href.includes('localhost') ? localhostAddress : gcpAddress;

const InsectsWebSocketUI = () => {
    const [clientData, setClientData] = useState<ClientData>({ uuid: '', status: 'unconnected', memory: {} });
    const ws = useRef<WebSocket | null>(null);

    (window as any).clientData = clientData;

    useEffect(() => {
        ws.current = new WebSocket(wssAddress);
        ws.current.onopen = () => {
            sendMessage({
                messageType: 'connectedFromClient',
                uuid: clientData.uuid,
                timeStamp: new Date().getTime(),
                payload: {}
            });
        };
        ws.current.onmessage = (event) => {
            const eventData: EventData = JSON.parse(event.data);
            handleIncomingMessage(eventData);
        };
        ws.current.onclose = () => {
           console.log('WebSocket connection closed');
        };
        ws.current.onerror = (error) => {
           console.log('WebSocket Error: ', error);
        };

        return () => {
            ws.current?.close();
        };
    }, []);

    const handleIncomingMessage = (eventData: EventData) => {
        switch (eventData.messageType) {
            case 'connectedFromServer':
                setClientData((prevData) => ({ ...prevData, uuid: eventData.payload.uuid }));
                break;
            case 'disconnectedFromServer':
                setClientData((prevData) => ({ ...prevData, status: eventData.messageType }));
                break;
            case 'broadcastUpdateFromServer': {
                const { uuid, updatePayload } = eventData.payload;
                setClientData((prevData) => ({
                    ...prevData,
                    memory: {
                        ...prevData.memory,
                        [uuid]: { ...prevData.memory[uuid], ...updatePayload.payload }
                    }
                }));
            }
                break;
            case 'broadcastDisconnectedFromServer': {
                const uuidToDelete = eventData.payload.uuid;
                setClientData((prevData) => {
                    const updatedMemory = { ...prevData.memory };
                    delete updatedMemory[uuidToDelete];
                    return { ...prevData, memory: updatedMemory };
                });
                break;
            }
        }
    };

    const sendMessage = (message: EventData) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(message));
        }
    };

    interface PayloadProps {
        [key: string]: any
    }

    const sendUpdate = (payload: PayloadProps) => {
        sendMessage({
            messageType: 'updateFromClient',
            uuid: clientData.uuid,
            payload,
            timeStamp: new Date().getTime()
        });
    };

    return (
        <>
            <InsectsControls sendUpdate={sendUpdate}/>
            {Object.keys(clientData.memory).map((socketInsectKey, index) => {
                return (
                    <InsectsSocketInsect
                        key={index}
                        position={clientData.memory[socketInsectKey].insectPosition}
                        rotation={clientData.memory[socketInsectKey].insectRotation}
                    />
                )
            })}
        </>
    );
};

export { InsectsWebSocketUI };