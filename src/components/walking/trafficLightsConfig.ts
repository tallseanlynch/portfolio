const trafficLightsConfig = {
    // light post
    northWest: {
        // traffic direction: ['active light name']
        // if !traffic direction && active light name = red light
        northSouth: ['straight'],
        northSouthTurning: ['leftTurn'],
        westTurning: ['leftTurn']
    },
    northEast: {
        westTurning: ['leftTurn', 'rightTurn']
    },
    southEast: {
        northSouth: ['straight'],
        northSouthTurning: ['rightTurn']
    },
    southWest: {}
};

const walkSignalConfig = {
    // light post
    northWest: {
        directionAB: {
            a: 'south',
            b: 'east',
            c: 'diagonal'
        },
        // traffic direction
        northSouth: {
            // walk signal direction
            // true = green
            south: true,
            east: false,
            diagonal: false
        },
        northSouthTurning: {
            south: false,
            east: false,
            diagonal: false
        },
        westTurning: {
            south: false,
            east: false,
            diagonal: false
        },
        noTraffic: {
            south: true,
            east: true,
            diagonal: true
        }
    },
    northEast: {
        directionAB: {
            a: 'west',
            b: 'south',
            c: 'diagonal'
        },
        northSouth: {
            south: true,
            west: false,
            diagonal: false
        },
        northSouthTurning: {
            south: true,
            west: false,
            diagonal: false
        },
        westTurning: {
            south: true,
            west: false,
            diagonal: false
        },
        noTraffic: {
            south: true,
            west: true,
            diagonal: true
        }
    },
    southEast: {
        directionAB: {
            a: 'north',
            b: 'west'
        },
        northSouth: {
            north: true,
            west: false
        },
        northSouthTurning: {
            north: true,
            west: false
        },
        westTurning: {
            north: true,
            west: false
        },
        noTraffic: {
            north: true,
            west: true
        }
    },
    southWest: {
        directionAB: {
            a: 'east',
            b: 'north'
        },
        northSouth: {
            north: true,
            east: false
        },
        northSouthTurning: {
            north: false,
            east: false
        },
        westTurning: {
            north: false,
            east: false
        },
        noTraffic: {
            north: true,
            east: true
        }        
    }
};

export { trafficLightsConfig, walkSignalConfig };