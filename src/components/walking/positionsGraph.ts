import { Vector3 } from 'three';

type GraphNode = {
    name: string;
    number: number;
    center: Vector3;
    width: number;
    height: number;
    startingConnections?: boolean;
    connections: string[];
    termination?: string[];
    walkConditions: {
        [key: string]: {
            northSouth: boolean,
            northSouthTurning: boolean,
            westTurning: boolean,
            noTraffic: boolean
        }
    }
}

const positionsGraph: GraphNode[] = [
    // NorthEast
    {
        name: 'NorthEast-Corner',
        number: 0,
        center: new Vector3(30.0, 0.0, -30.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'SouthEast-Corner',
            'NorthWest-Corner',
            'NorthEast-NorthStreet-CornerEnd',
            'NorthEast-EastStreet-CornerEnd',
            'SouthEast-EastStreet-CornerEnd'
        ],
        walkConditions: {
            'SouthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'NorthWest-Corner': {
                northSouth: false,
                northSouthTurning: false,
                westTurning: false,
                noTraffic: true
            },
            'NorthEast-NorthStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'NorthEast-EastStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'SouthEast-EastStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'NorthEast-NorthStreet',
        number: 1,
        center: new Vector3(30.0, 0.0, -90.0),
        width: 10.0,
        height: 100.0,
        startingConnections: true,
        connections: [
            'NorthEast-Corner',
            'NorthEast-NorthStreet-CornerEnd'
        ],
        walkConditions: {
            'NorthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'NorthEast-NorthStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'NorthEast-NorthStreet-CornerEnd',
        number: 2,
        center: new Vector3(30.0, 0.0, -145.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'NorthEast-Corner'
        ],
        termination: [
            'SouthEast-SouthStreet-CornerEnd'
        ],
        walkConditions: {
            'NorthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'NorthEast-EastStreet',
        number: 3,
        center: new Vector3(90.0, 0.0, -30.0),
        width: 100.0,
        height: 10.0,
        startingConnections: true,
        connections: [
            'NorthEast-Corner',
            'NorthEast-EastStreet-CornerEnd'
        ],
        walkConditions: {
            'NorthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'NorthEast-EastStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'NorthEast-EastStreet-CornerEnd',
        number: 4,
        center: new Vector3(145.0, 0.0, -30.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'NorthEast-Corner'
        ],
        termination: [
            'NorthWest-WestStreet-CornerEnd'
        ],
        walkConditions: {
            'NorthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    
    // SouthEast
    {
        name: 'SouthEast-Corner',
        number: 5,
        center: new Vector3(30.0, 0.0, 30.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'NorthEast-Corner',
            'SouthWest-Corner',
            'SouthEast-SouthStreet-CornerEnd',
            'SouthEast-EastStreet-CornerEnd',
            'NorthWest-Corner'
        ],
        walkConditions: {
            'NorthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'SouthWest-Corner': {
                northSouth: false,
                northSouthTurning: false,
                westTurning: false,
                noTraffic: true
            },
            'SouthEast-SouthStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'SouthEast-EastStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'NorthWest-Corner': {
                northSouth: false,
                northSouthTurning: false,
                westTurning: false,
                noTraffic: true
            }
        }
    },
    {
        name: 'SouthEast-SouthStreet',
        number: 6,
        center: new Vector3(30.0, 0.0, 90.0),
        width: 10.0,
        height: 100.0,
        startingConnections: true,
        connections: [
            'SouthEast-Corner',
            'SouthEast-SouthStreet-CornerEnd'
        ],
        walkConditions: {
            'SouthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'SouthEast-SouthStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'SouthEast-SouthStreet-CornerEnd',
        number: 7,
        center: new Vector3(30.0, 0.0, 145.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'SouthEast-Corner'
        ],
        termination: [
            'NorthEast-NorthStreet-CornerEnd'
        ],
        walkConditions: {
            'SouthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'SouthEast-EastStreet',
        number: 8,
        center: new Vector3(90.0, 0.0, 30.0),
        width: 100.0,
        height: 10.0,
        startingConnections: true,
        connections: [
            'SouthEast-Corner',
            'SouthEast-EastStreet-CornerEnd'
        ],
        walkConditions: {
            'SouthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'SouthEast-EastStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'SouthEast-EastStreet-CornerEnd',
        number: 9,
        center: new Vector3(145.0, 0.0, 30.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'SouthEast-Corner',
            'NorthEast-Corner'
        ],
        termination: [
            'SouthWest-WestStreet-CornerEnd'
        ],
        walkConditions: {
            'SouthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'NorthEast-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },

    // NorthWest
    {
        name: 'NorthWest-Corner',
        number: 10,
        center: new Vector3(-30.0, 0.0, -30.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'SouthWest-Corner',
            'NorthEast-Corner',
            'NorthWest-NorthStreet-CornerEnd',
            'NorthWest-WestStreet-CornerEnd',
            'SouthEast-Corner'
        ],
        walkConditions: {
            'SouthWest-Corner': {
                northSouth: true,
                northSouthTurning: false,
                westTurning: false,
                noTraffic: true
            },
            'NorthEast-Corner': {
                northSouth: false,
                northSouthTurning: false,
                westTurning: false,
                noTraffic: true
            },
            'NorthWest-NorthStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'NorthWest-WestStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'SouthEast-Corner': {
                northSouth: false,
                northSouthTurning: false,
                westTurning: false,
                noTraffic: true
            }
        }
    },
    {
        name: 'NorthWest-NorthStreet',
        number: 11,
        center: new Vector3(-30.0, 0.0, -90.0),
        width: 10.0,
        height: 100.0,
        startingConnections: true,
        connections: [
            'NorthWest-Corner',
            'NorthWest-NorthStreet-CornerEnd'
        ],
        walkConditions: {
            'NorthWest-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'NorthWest-NorthStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'NorthWest-NorthStreet-CornerEnd',
        number: 12,
        center: new Vector3(-30.0, 0.0, -145.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'NorthWest-Corner'
        ],
        termination: [
            'SouthWest-SouthStreet-CornerEnd'
        ],
        walkConditions: {
            'NorthWest-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'NorthWest-WestStreet',
        number: 13.0,
        center: new Vector3(-90.0, 0.0, -30.0),
        width: 100,
        height: 10.0,
        startingConnections: true,
        connections: [
            'NorthWest-Corner',
            'NorthWest-WestStreet-CornerEnd'
        ],
        walkConditions: {
            'NorthWest-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'NorthWest-WestStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'NorthWest-WestStreet-CornerEnd',
        number: 14,
        center: new Vector3(-145.0, 0.0, -30.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'NorthWest-Corner'
        ],
        termination: [
            'NorthEast-EastStreet-CornerEnd'
        ],
        walkConditions: {
            'NorthWest-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },

    // SouthWest
    {
        name: 'SouthWest-Corner',
        center: new Vector3(-30.0, 0.0, 30.0),
        number: 15,
        width: 10.0,
        height: 10.0,
        connections: [
            'NorthWest-Corner',
            'SouthEast-Corner',
            'SouthWest-SouthStreet-CornerEnd',
            'SouthWest-WestStreet-CornerEnd'
        ],
        walkConditions: {
            'NorthWest-Corner': {
                northSouth: true,
                northSouthTurning: false,
                westTurning: false,
                noTraffic: true
            },
            'SouthEast-Corner': {
                northSouth: false,
                northSouthTurning: false,
                westTurning: false,
                noTraffic: true
            },
            'SouthWest-SouthStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'SouthWest-WestStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'SouthWest-SouthStreet',
        number: 16,
        center: new Vector3(-30.0, 0.0, 90.0),
        width: 10.0,
        height: 100.0,
        startingConnections: true,
        connections: [
            'SouthWest-Corner',
            'SouthWest-SouthStreet-CornerEnd'
        ],
        walkConditions: {
            'SouthWest-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'SouthWest-SouthStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'SouthWest-SouthStreet-CornerEnd',
        number: 17,
        center: new Vector3(-30.0, 0.0, 145.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'SouthWest-Corner'
        ],
        termination: [
            'NorthWest-NorthStreet-CornerEnd'
        ],
        walkConditions: {
            'SouthWest-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'SouthWest-WestStreet',
        number: 18,
        center: new Vector3(-90.0, 0.0, 30.0),
        width: 100.0,
        height: 10.0,
        startingConnections: true,
        connections: [
            'SouthWest-Corner',
            'SouthWest-WestStreet-CornerEnd'
        ],
        walkConditions: {
            'SouthWest-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            },
            'SouthWest-WestStreet-CornerEnd': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    },
    {
        name: 'SouthWest-WestStreet-CornerEnd',
        number: 19,
        center: new Vector3(-145.0, 0.0, 30.0),
        width: 10.0,
        height: 10.0,
        connections: [
            'SouthWest-Corner'
        ],
        termination: [
            'SouthEast-EastStreet-CornerEnd'
        ],
        walkConditions: {
            'SouthWest-Corner': {
                northSouth: true,
                northSouthTurning: true,
                westTurning: true,
                noTraffic: true
            }
        }
    }
];

// create shader friendly arrays
const createGraphArrays = (graphs: GraphNode[]) => {
    const graphPositions: number[][] = Array(graphs.length).fill([]);
    const graphConnections: number[][] = Array(graphs.length).fill([]);
    const graphConnectionsWalkConditions: boolean[][][] = Array(graphs.length).fill([]);
    const graphConnectionsWalkConditionsFlatInt: number[][] = Array(graphs.length).fill(0);
    const graphTerminations: number[][] = Array(graphs.length).fill([]);

    const graphConnectionsLengths: number[] = Array(graphs.length).fill(0);
    const graphTerminationsLengths: number[] = Array(graphs.length).fill(0);

    graphs.forEach((graph: GraphNode) => {
        graphPositions[graph.number] = [
            graph.center.x,
            graph.center.y,
            graph.center.z,
            graph.width,
            graph.height
        ];

        const graphConnectionNumbers: number[] = [];
        graph.connections.forEach((connection: string) => {
            graphs.forEach((checkGraph: GraphNode) => {
                if(checkGraph.name === connection) {
                    graphConnectionNumbers.push(checkGraph.number);
                }
            })
        })
        graphConnections[graph.number] = graphConnectionNumbers;

        const graphConnectionBooleans: boolean[][] = [];
        const graphConnectionIntFlat: number[] = [];
        const walkConditionsKeys = Object.keys(graph.walkConditions);
        walkConditionsKeys.forEach(wc => {
            const walkConditionValues = Object.values(graph.walkConditions[wc]);
            const walkConditionValuesInt = walkConditionValues.map(v => v === true ? 1 : 0);
            graphConnectionBooleans.push(walkConditionValues);
            graphConnectionIntFlat.push(...walkConditionValuesInt);
        });
        graphConnectionsWalkConditions[graph.number] = graphConnectionBooleans;
        graphConnectionsWalkConditionsFlatInt[graph.number] = graphConnectionIntFlat;


        const graphTerminationNumbers: number[] = [];
        if(graph.termination !== undefined) {
            graph.termination.forEach((termination: string) => {
                graphs.forEach((checkGraph: GraphNode) => {
                    if(checkGraph.name === termination) {
                        graphTerminationNumbers.push(checkGraph.number);
                    }
                })
            })
            graphTerminations[graph.number] = graphTerminationNumbers;    
        } else {
            graphTerminations[graph.number] = [];
        }

        graphConnectionsLengths[graph.number] = graphConnections[graph.number].length;
        graphTerminationsLengths[graph.number] = graphTerminations[graph.number].length;

    });

    // create the buffer arrays
    const dataHeight = graphPositions.length;

    const positionsDataSize = 5 * dataHeight;
    const dataPositions = new Float32Array(positionsDataSize);

    const connectionsDataSize = 6 * dataHeight;
    const dataConnections = new Float32Array(connectionsDataSize);

    const connectionsWalkConditionsDataSize = 20 * dataHeight;
    const dataConnectionsWalkConditions = new Float32Array(connectionsWalkConditionsDataSize);

    const terminationsDataSize = 2 * dataHeight;
    const dataTerminations = new Float32Array(terminationsDataSize);

    const dataArrays = [
        dataPositions,
        dataConnections,
        dataTerminations
    ];

    dataArrays.forEach(dataArray => {
        for(let dataIndex = 0; dataIndex < dataArray.length; dataIndex ++) {
            dataArray[dataIndex] = -1.0;
        }
    });

    for(let dataRow = 0; dataRow < dataHeight; dataRow ++) {
        dataPositions[dataRow * 5] = graphPositions[dataRow][0]; // centerx
        dataPositions[dataRow * 5 + 1] = graphPositions[dataRow][1]; // centery
        dataPositions[dataRow * 5 + 2] = graphPositions[dataRow][2]; // centerz
        dataPositions[dataRow * 5 + 3] = graphPositions[dataRow][3]; // width
        dataPositions[dataRow * 5 + 4] = graphPositions[dataRow][4]; // height

        for(let graphConnectionIndex = 0; graphConnectionIndex < graphConnectionsLengths[dataRow]; graphConnectionIndex++) {
            dataConnections[dataRow * 6 + graphConnectionIndex] = graphConnections[dataRow][graphConnectionIndex];
        }

        for(let graphConnectionWalkConditionIndex = 0; graphConnectionWalkConditionIndex < graphConnectionsWalkConditionsFlatInt[dataRow].length; graphConnectionWalkConditionIndex++) {
            dataConnectionsWalkConditions[dataRow * 20 + graphConnectionWalkConditionIndex] = graphConnectionsWalkConditionsFlatInt[dataRow][graphConnectionWalkConditionIndex];
        }

        for(let graphTerminationIndex = 0; graphTerminationIndex < graphTerminationsLengths[dataRow]; graphTerminationIndex++) {
            dataTerminations[dataRow * 2 + graphTerminationIndex] = graphTerminations[dataRow][graphTerminationIndex];
        }
    }

    return {
        graphPositions,
        graphConnections,
        graphConnectionsWalkConditions,
        graphConnectionsWalkConditionsFlatInt,
        graphTerminations,
        graphConnectionsLengths,
        graphTerminationsLengths,
        dataPositions,
        dataConnections,
        dataConnectionsWalkConditions,
        dataTerminations
    }
}

const graphArrays = createGraphArrays(positionsGraph);
(window as any).graphArrays = graphArrays;
console.log(graphArrays);

export { positionsGraph, graphArrays };