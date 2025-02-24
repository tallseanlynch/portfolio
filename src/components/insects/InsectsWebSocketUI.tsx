import {
    useState,
    useEffect,
    useRef
} from 'react';
import { Vector3, Color } from 'three';
import { ClientData, EventData } from './websocket-types';
import { InsectsControls } from './InsectsControls';
import { InsectsSocketInsect } from './InsectsSocketInsect';
import { colors } from './insectsColors';

const localhostAddress = 'ws://localhost:8080';
const gcpAddress = 'wss://websocket-service-943494934642.us-central1.run.app';
const wssAddress = window.location.href.includes('localhost') ? localhostAddress : gcpAddress;
const clientColorNumber = Math.floor(Math.random() * colors.length);
const clientColor = colors[clientColorNumber];
const patternSpotMagnitude = .45;
const clientPatternSpots = [
    new Vector3().random().multiplyScalar(patternSpotMagnitude),
    new Vector3().random().multiplyScalar(patternSpotMagnitude),
    new Vector3().random().multiplyScalar(patternSpotMagnitude),
    new Vector3().random().multiplyScalar(patternSpotMagnitude),
    new Vector3().random().multiplyScalar(patternSpotMagnitude)
]

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

        console.log('InsectsWebSocketUI')

        return () => {
            ws.current?.close();
        };
    }, []);

    // useEffect(() => {
    //     console.log(`${JSON.stringify(clientData, null, 2)}`);
    // }, [clientData])

    const handleIncomingMessage = (eventData: EventData) => {
        switch (eventData.messageType) {
            case 'connectedFromServer':
                setClientData((prevData) => {return { 
                    ...prevData, 
                    uuid: eventData.payload.uuid
                }});
                break;
            case 'disconnectedFromServer':
                setClientData((prevData) => {return { ...prevData, status: eventData.messageType }});
                break;
            case 'broadcastUpdateFromServer': {
                const { uuid, updatePayload } = eventData.payload;
                // if(updatePayload.payload.insectColor !== undefined) {
                //     console.log(updatePayload.payload.insectColor);
                // }
                setClientData((prevData) => {
                    return {
                        ...prevData,
                        memory: {
                            ...prevData.memory,
                            [uuid]: { ...prevData.memory[uuid], ...updatePayload }
                        }    
                    }
                });
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
            <InsectsControls 
                sendUpdate={sendUpdate} 
                clientColor={clientColor}
                clientPatternSpots={clientPatternSpots}
            />
            {Object.keys(clientData.memory).map(socketInsectKey => {
                
                const convertArrayToVector3Array = (spotsArray) => {
                    return [
                        new Vector3().set(spotsArray[0].x, spotsArray[0].y, spotsArray[0].z),
                        new Vector3().set(spotsArray[1].x, spotsArray[1].y, spotsArray[1].z),
                        new Vector3().set(spotsArray[2].x, spotsArray[2].y, spotsArray[2].z),
                        new Vector3().set(spotsArray[3].x, spotsArray[3].y, spotsArray[3].z),
                        new Vector3().set(spotsArray[4].x, spotsArray[4].y, spotsArray[4].z),    
                    ]
                }

                return (
                    <InsectsSocketInsect
                        key={socketInsectKey}
                        position={clientData.memory[socketInsectKey].insectPosition}
                        rotation={clientData.memory[socketInsectKey].insectRotation}
                        color={new Color(clientData.memory[socketInsectKey].insectColor)}
                        patternSpots={convertArrayToVector3Array(clientData.memory[socketInsectKey].insectPatternSpots)}
                    />
                )
            })}
        </>
    );
};

export { InsectsWebSocketUI };