const trafficLightsConfig = {
    // light post
    northWest: {
        // traffic direction: ['active light name']
        // if !traffic direction && active light name = red light
        northSouth: ['straight'],
        northSouthTurning: ['leftTurn']
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
        // traffic direction
        northSouth: {
            // walk signal direction
            // true = green
            south: true,
            east: false
        },
        northSouthTurning: {
            south: false,
            east: false
        },
        westTurning: {
            south: false,
            east: false
        },
        noTraffic: {
            south: true,
            east: true
        }
    },
    northEast: {
        northSouth: {
            south: true,
            west: false
        },
        northSouthTurning: {
            south: true,
            west: false
        },
        westTurning: {
            south: true,
            west: false
        },
        noTraffic: {
            south: true,
            west: true
        }
    },
    southEast: {
        northSouth: {
            north: true,
            west: false
        },
        northSouthTurning: {
            north: true,
            west: false
        },
        westTurning: {
            south: true,
            west: false
        },
        noTraffic: {
            south: true,
            west: true
        }
    },
    southWest: {
        northSouth: {
            north: true,
            east: false
        },
        northSouthTurning: {
            north: false,
            east: false
        },
        westTurning: {
            south: false,
            west: false
        },
        noTraffic: {
            south: true,
            west: true
        }        
    }
};

export { trafficLightsConfig, walkSignalConfig };