import { 
    useEffect, 
    useState
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
  
    useEffect(() => {
        const interval = setInterval(() => {
                setInstanceStats(instances());
        }, updateTimeMS);

        return () => clearInterval(interval);

    }, [updateTimeMS]);
  
    return (
        <div className="instance-stats-text">
            {
                Object.keys(instanceStats)
                    .filter(instanceStat => instanceStats[instanceStat] > 0 || showAll === true)
                    .map((instanceStat: string , index: number) => {
                        if(stats.indexOf(instanceStat) > -1 || (stats.length === 0 && instanceStats[instanceStat] > 0) || showAll === true) {
                            return (
                                <div className={`instance-stat ${index % 2 === 0 ? 'gray-stat' : ''}`} key={instanceStat}>
                                    <span className="stat-name">{instanceStat}:</span>
                                    <span className="stat-value">{instanceStats[instanceStat]}</span>
                                </div>
                            )    
                        }
                    })
            }
        </div>
    );
};

export { InstanceStats }