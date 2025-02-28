import { 
    useEffect, 
    useState,
    useCallback
} from 'react';
import { instances } from './index'
import './instance-stats.css';

interface InstanceStatsProps {
    updateTimeMS?: number;
    stats?: string[];
    showAll?: boolean;
}

const InstanceStats: React.FC<InstanceStatsProps> = ({
    updateTimeMS = 500, 
    stats = [], 
    showAll = false
}) => {
    const [instanceStats, setInstanceStats] = useState<{[key: string]: number}>({});
    const [visible, setVisible] = useState<boolean>(true)

    const handleVisibleClick = useCallback(() => {
        setVisible(current => !current)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
                setInstanceStats(instances());
        }, updateTimeMS);

        return () => clearInterval(interval);

    }, [updateTimeMS]);
  
    const statsToShow = Object.keys(instanceStats)
        .filter(instanceStat => instanceStats[instanceStat] > 0 || showAll === true)
        .filter(instanceStat => stats.indexOf(instanceStat) > -1 || (stats.length === 0 && instanceStats[instanceStat] > 0) || showAll === true);

    return (
        <div className={`instance-stats-container ${statsToShow.length > 25 && visible === true ? 'length-25-plus' : ''}`}>
            <div className='instance-stats-button'>
                <button onClick={handleVisibleClick}>{visible === true ? 'Hide Instance Stats' : 'Show Instance Stats'}</button>
            </div>
            {visible === true && 
                <div 
                    className='instance-stats-text'
                    style={{width: Math.ceil(statsToShow.length / 25) * 225}}
                >
                    {
                        statsToShow.map((instanceStat: string , index: number) => {
                            return (
                                <div className={`instance-stat ${index % 2 === 0 ? 'gray-stat' : ''}`} key={instanceStat}>
                                    <span className="stat-name">{instanceStat}:</span>
                                    <span className="stat-value">{instanceStats[instanceStat]}</span>
                                </div>
                            )    
                        })
                    }
                </div>        
            }
        </div>
    );
};

export { InstanceStats };