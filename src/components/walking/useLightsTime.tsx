import { useEffect, useState } from 'react';

const useLightsTime = () => {
    const [lightsTime, setLightsTime] = useState({
        currentTime: 0,
        activeLight: {
          name: 'northSouth',
          number: 0,
          length: 45 * 1000
        },
        activeLightNumber: 0,
        activeLightTimeLeft: 0
    });
  
    useEffect(() => {
        const lightsIntervalLength = 200;  
        const lightsSequence = [
            {
                name: 'northSouth',
                number: 0,
                length: 45 * 1000,
                timeLeft: 0
            }, 
            {
                name: 'northSouthTurning',
                number: 1,
                length: 15 * 1000,
                timeLeft: 0
            }, 
            {
                name: 'westTurning',
                number: 2,
                length: 45 * 1000,
                timeLeft: 0
            }, 
            {
                name: 'noTraffic',
                number: 3,
                length: 60 * 1000,
                timeLeft: 0
            }
        ];
  
        const totalLengthOfTime = lightsSequence.reduce((total, currentValue) => {
            return total + currentValue.length
        }, 0) 
  
        const determineActiveLight = (time) => {
            let activeLight = lightsSequence[0];
  
            lightsSequence.reduce((total, currentValue) => {
                const lightsSequenceTotalPlusCurrent = total + currentValue.length;
                const cycleTime = time % totalLengthOfTime;
                if(cycleTime >= total && cycleTime <= lightsSequenceTotalPlusCurrent) {
                  activeLight = currentValue;
                  activeLight.timeLeft = activeLight.length - (cycleTime - total);
                //   console.log(activeLight.name, activeLight.timeLeft)
                }
  
                return lightsSequenceTotalPlusCurrent
            }, 0)     
  
            return activeLight;
        }
  
        const lightsInterval = setInterval(() => {
            setLightsTime(current => {
                const currentActiveLight = determineActiveLight(current.currentTime + lightsIntervalLength)
                return {
                    ...current, 
                    currentTime: current.currentTime + lightsIntervalLength,
                    activeLight: currentActiveLight,
                    activeLightNumber: currentActiveLight.number,
                    activeLightTimeLeft: currentActiveLight.timeLeft
                }
            });
        }, lightsIntervalLength)
  
        return () => clearInterval(lightsInterval);
    }, [])

    return lightsTime;
};

export { useLightsTime };