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

const patternSpotInitialValues = [
    {
        "x": -0.2697212401556805,
        "y": 0.15278923470877115,
        "z": 0.0
    },
    {
        "x": -0.2697212401556805,
        "y": 0.3527892347087711,
        "z": 0.0
    },
    {
        "x": -0.2697212401556805,
        "y": -0.15278923470877115,
        "z": 0.0
    },
    {
        "x": -0.4697212401556805,
        "y": 0.5278923470877115,
        "z": 0.0
    },
    {
        "x": -0.4697212401556805,
        "y": -0.5278923470877115,
        "z": 0.0
    },
]

const createPatternSpots = (patternSpots: {x: number, y: number, z: number}[]) => {
    const patternSpotsArray: Vector3[] = []
    for(let ps = 0; ps < patternSpots.length; ps++) {
        patternSpotsArray.push(new Vector3(
            patternSpots[ps].x + (Math.random() * .4) -.2,
            patternSpots[ps].y + (Math.random() * .4) -.2,
            patternSpots[ps].z + (Math.random() * .4) -.2
        ))
    }
    return patternSpotsArray;
}

const clientPatternSpots = createPatternSpots(patternSpotInitialValues)
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
                setClientData((prevData) => {
                    if(prevData.memory[uuid] === undefined) {
                        return {
                            ...prevData,
                            memory: {
                                ...prevData.memory,
                                [uuid]: { 
                                    ...prevData.memory[uuid], 
                                    ...updatePayload,
                                    patternSpotsCalc: [
                                        new Vector3(),
                                        new Vector3(),
                                        new Vector3(),
                                        new Vector3(),
                                        new Vector3()
                                    ],
                                    colorCalc: new Color()
                                }
                            }    
                        }    
                    } else {
                        return {
                            ...prevData,
                            memory: {
                                ...prevData.memory,
                                [uuid]: { ...prevData.memory[uuid], ...updatePayload }
                            }    
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
        [key: string]: any;
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
                if(clientData.memory[socketInsectKey] === undefined || clientData.memory[socketInsectKey].insectPatternSpots === undefined) { return }

                const spotsArray = clientData.memory[socketInsectKey].insectPatternSpots;
                
                clientData.memory[socketInsectKey].patternSpotsCalc[0].set(spotsArray[0].x, spotsArray[0].y, spotsArray[0].z)
                clientData.memory[socketInsectKey].patternSpotsCalc[1].set(spotsArray[1].x, spotsArray[1].y, spotsArray[1].z)
                clientData.memory[socketInsectKey].patternSpotsCalc[2].set(spotsArray[2].x, spotsArray[2].y, spotsArray[2].z)
                clientData.memory[socketInsectKey].patternSpotsCalc[3].set(spotsArray[3].x, spotsArray[3].y, spotsArray[3].z)
                clientData.memory[socketInsectKey].patternSpotsCalc[4].set(spotsArray[4].x, spotsArray[4].y, spotsArray[4].z)

                clientData.memory[socketInsectKey].colorCalc.set(clientData.memory[socketInsectKey].insectColor)

                return (
                    <InsectsSocketInsect
                        key={socketInsectKey}
                        position={clientData.memory[socketInsectKey].insectPosition}
                        rotation={clientData.memory[socketInsectKey].insectRotation}
                        color={clientData.memory[socketInsectKey].colorCalc}
                        patternSpots={clientData.memory[socketInsectKey].patternSpotsCalc}
                    />
                )
            })}
        </>
    );
};

export { InsectsWebSocketUI };