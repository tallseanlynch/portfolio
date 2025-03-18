import { Vector3 } from 'three';

const startingPositions = [
    // NorthEast
    {
        name: 'NorthEast-Corner',
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
        center: new Vector3(30, 0, -90),
        width: 10,
        height: 100
    },
    {
        name: 'NorthEast-NorthStreet-CornerEnd',
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
        center: new Vector3(90, 0, -30),
        width: 100,
        height: 10
    },
    {
        name: 'NorthEast-EastStreet-CornerEnd',
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
        center: new Vector3(30, 0, 90),
        width: 10,
        height: 100
    },
    {
        name: 'SouthEast-SouthStreet-CornerEnd',
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
        center: new Vector3(90, 0, 30),
        width: 100,
        height: 10
    },
    {
        name: 'SouthEast-EastStreet-CornerEnd',
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
        center: new Vector3(-30, 0, -90),
        width: 10,
        height: 100
    },
    {
        name: 'NorthWest-NorthStreet-CornerEnd',
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
        center: new Vector3(-90, 0, -30),
        width: 100,
        height: 10
    },
    {
        name: 'NorthWest-WestStreet-CornerEnd',
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
        center: new Vector3(-30, 0, 90),
        width: 10,
        height: 100
    },
    {
        name: 'SouthWest-SouthStreet-CornerEnd',
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
        center: new Vector3(-90, 0, 30),
        width: 100,
        height: 10
    },
    {
        name: 'SouthWest-WestStreet-CornerEnd',
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

export { startingPositions };