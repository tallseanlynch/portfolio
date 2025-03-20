import { DataTexture, FloatType, RGBAFormat, Vector3 } from 'three';

type GraphNode = {
    name: string;
    number: number;
    center: Vector3;
    width: number;
    height: number;
    startingConnections?: boolean;
    connections: string[];
    termination?: string[];
}

const positionsGraph: GraphNode[] = [
    // NorthEast
    {
        name: 'NorthEast-Corner',
        number: 0,
        center: new Vector3(30, 0, -30),
        width: 10,
        height: 10,
        connections: [
            'SouthEast-Corner',
            'NorthWest-Corner',
            'NorthEast-NorthStreet-CornerEnd',
            'NorthEast-EastStreet-CornerEnd'
        ]
    },
    {
        name: 'NorthEast-NorthStreet',
        number: 1,
        center: new Vector3(30, 0, -90),
        width: 10,
        height: 100,
        startingConnections: true,
        connections: [
            'NorthEast-Corner',
            'NorthEast-NorthStreet-CornerEnd'
        ]
    },
    {
        name: 'NorthEast-NorthStreet-CornerEnd',
        number: 2,
        center: new Vector3(30, 0, -145),
        width: 10,
        height: 10,
        connections: [
            'NorthEast-Corner'
        ],
        termination: [
            'SouthEast-SouthStreet-CornerEnd'
        ]
    },
    {
        name: 'NorthEast-EastStreet',
        number: 3,
        center: new Vector3(90, 0, -30),
        width: 100,
        height: 10,
        startingConnections: true,
        connections: [
            'NorthEast-Corner',
            'NorthEast-EastStreet-CornerEnd'
        ]
    },
    {
        name: 'NorthEast-EastStreet-CornerEnd',
        number: 4,
        center: new Vector3(145, 0, -30),
        width: 10,
        height: 10,
        connections: [
            'NorthEast-Corner'
        ],
        termination: [
            'NorthWest-WestStreet-CornerEnd'
        ]
    },
    
    // SouthEast
    {
        name: 'SouthEast-Corner',
        number: 5,
        center: new Vector3(30, 0, 30),
        width: 10,
        height: 10,
        connections: [
            'NorthEast-Corner',
            'SouthWest-Corner',
            'SouthEast-SouthStreet-CornerEnd',
            'SouthEast-EastStreet-CornerEnd'
        ]
    },
    {
        name: 'SouthEast-SouthStreet',
        number: 6,
        center: new Vector3(30, 0, 90),
        width: 10,
        height: 100,
        startingConnections: true,
        connections: [
            'SouthEast-Corner',
            'SouthEast-SouthStreet-CornerEnd'
        ]
    },
    {
        name: 'SouthEast-SouthStreet-CornerEnd',
        number: 7,
        center: new Vector3(30, 0, 145),
        width: 10,
        height: 10,
        connections: [
            'SouthEast-Corner'
        ],
        termination: [
            'NorthEast-NorthStreet-CornerEnd'
        ]
    },
    {
        name: 'SouthEast-EastStreet',
        number: 8,
        center: new Vector3(90, 0, 30),
        width: 100,
        height: 10,
        startingConnections: true,
        connections: [
            'SouthEast-Corner',
            'SouthEast-EastStreet-CornerEnd'
        ]
    },
    {
        name: 'SouthEast-EastStreet-CornerEnd',
        number: 9,
        center: new Vector3(145, 0, 30),
        width: 10,
        height: 10,
        connections: [
            'SouthEast-Corner'
        ],
        termination: [
            'SouthWest-WestStreet-CornerEnd'
        ]
    },

    // NorthWest
    {
        name: 'NorthWest-Corner',
        number: 10,
        center: new Vector3(-30, 0, -30),
        width: 10,
        height: 10,
        connections: [
            'SouthWest-Corner',
            'NorthEast-Corner',
            'NorthWest-NorthStreet-CornerEnd',
            'NorthWest-WestStreet-CornerEnd'
        ]
    },
    {
        name: 'NorthWest-NorthStreet',
        number: 11,
        center: new Vector3(-30, 0, -90),
        width: 10,
        height: 100,
        startingConnections: true,
        connections: [
            'NorthWest-Corner',
            'NorthWest-NorthStreet-CornerEnd'
        ]
    },
    {
        name: 'NorthWest-NorthStreet-CornerEnd',
        number: 12,
        center: new Vector3(-30, 0, -145),
        width: 10,
        height: 10,
        connections: [
            'NorthWest-Corner'
        ],
        termination: [
            'SouthWest-SouthStreet-CornerEnd'
        ]
    },
    {
        name: 'NorthWest-WestStreet',
        number: 13,
        center: new Vector3(-90, 0, -30),
        width: 100,
        height: 10,
        startingConnections: true,
        connections: [
            'NorthWest-Corner',
            'NorthWest-WestStreet-CornerEnd'
        ]
    },
    {
        name: 'NorthWest-WestStreet-CornerEnd',
        number: 14,
        center: new Vector3(-145, 0, -30),
        width: 10,
        height: 10,
        connections: [
            'NorthWest-Corner'
        ],
        termination: [
            'NorthEast-EastStreet-CornerEnd'
        ]
    },

    // SouthWest
    {
        name: 'SouthWest-Corner',
        center: new Vector3(-30, 0, 30),
        number: 15,
        width: 10,
        height: 10,
        connections: [
            'NorthWest-Corner',
            'SouthEast-Corner',
            'SouthWest-SouthStreet-CornerEnd',
            'SouthWest-WestStreet-CornerEnd'
        ]
    },
    {
        name: 'SouthWest-SouthStreet',
        number: 16,
        center: new Vector3(-30, 0, 90),
        width: 10,
        height: 100,
        startingConnections: true,
        connections: [
            'SouthWest-Corner',
            'SouthWest-SouthStreet-CornerEnd'
        ]
    },
    {
        name: 'SouthWest-SouthStreet-CornerEnd',
        number: 17,
        center: new Vector3(-30, 0, 145),
        width: 10,
        height: 10,
        connections: [
            'SouthWest-Corner'
        ],
        termination: [
            'NorthWest-NorthStreet-CornerEnd'
        ]
    },
    {
        name: 'SouthWest-WestStreet',
        number: 18,
        center: new Vector3(-90, 0, 30),
        width: 100,
        height: 10,
        startingConnections: true,
        connections: [
            'SouthWest-Corner',
            'SouthWest-WestStreet-CornerEnd'
        ]
    },
    {
        name: 'SouthWest-WestStreet-CornerEnd',
        number: 19,
        center: new Vector3(-145, 0, 30),
        width: 10,
        height: 10,
        connections: [
            'SouthWest-Corner'
        ],
        termination: [
            'SouthEast-EastStreet-CornerEnd'
        ]
    }
];

// create shader friendly arrays and dataTextyres
const createGraphArrays = (graphs: GraphNode[]) => {
    const graphPositions: number[][] = Array(graphs.length).fill([]);
    const graphConnections: number[][] = Array(graphs.length).fill([]);
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

    // create the DataTextures
    const dataWidth = 10;
    const dataHeight = graphPositions.length;
    const dataSize = dataWidth * dataHeight * 4;
    const dataPositions = new Float32Array(dataSize);
    const dataConnections = new Float32Array(dataSize);
    const dataTerminations = new Float32Array(dataSize);

    const dataArrays = [
        dataPositions,
        dataConnections,
        dataTerminations
    ];

    dataArrays.forEach(dataArray => {
        for(let dataIndex = 0; dataIndex < dataSize; dataIndex ++) {
            dataArray[dataIndex] = 0.0;
        }
    });

    for(let dataRow = 0; dataRow < dataHeight; dataRow ++) {
        dataPositions[dataRow * 10] = graphPositions[dataRow][0]; // centerx
        dataPositions[dataRow * 10 + 1] = graphPositions[dataRow][1]; // centery
        dataPositions[dataRow * 10 + 2] = graphPositions[dataRow][2]; // centerz
        dataPositions[dataRow * 10 + 3] = graphPositions[dataRow][3]; // width
        dataPositions[dataRow * 10 + 4] = graphPositions[dataRow][4]; // height

        for(let graphConnectionIndex = 0; graphConnectionIndex < graphConnectionsLengths[dataRow]; graphConnectionIndex++) {
            dataConnections[dataRow * 10 + graphConnectionIndex] = graphConnections[dataRow][graphConnectionIndex];
        }

        for(let graphTerminationIndex = 0; graphTerminationIndex < graphTerminationsLengths[dataRow]; graphTerminationIndex++) {
            dataTerminations[dataRow * 10 + graphTerminationIndex] = graphTerminations[dataRow][graphTerminationIndex];
        }
    }

    const dataPositionsTexture = new DataTexture(dataPositions, 10, dataHeight, RGBAFormat, FloatType);
    dataPositionsTexture.needsUpdate = true;
    
    const dataConnectionsTexture = new DataTexture(dataConnections, 10, dataHeight, RGBAFormat, FloatType);
    dataConnectionsTexture.needsUpdate = true;

    const dataTerminationsTexture = new DataTexture(dataTerminations, 10, dataHeight, RGBAFormat, FloatType);
    dataTerminationsTexture.needsUpdate = true;

    return {
        graphPositions,
        graphConnections,
        graphTerminations,
        graphConnectionsLengths,
        graphTerminationsLengths,
        dataPositionsTexture,
        dataConnectionsTexture,
        dataTerminationsTexture
    }
}

const graphArrays = createGraphArrays(positionsGraph)
console.log(graphArrays);

export { positionsGraph, graphArrays };