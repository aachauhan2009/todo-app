import styles from './styles.module.css';
import { statuses } from "./constants";

interface StatusTabsProps {
    selectedStatus: string;
    setSelectedStatus: (status: string) => void;
}

const StatusTabs: React.FC<StatusTabsProps> = ({ selectedStatus, setSelectedStatus }) => {
    return (
        <div className={styles.tabs}>
            {statuses.map((status) => (
                <button
                    key={status.value}
                    className={`${selectedStatus === status.value ? styles.selectedTab : ""} ${styles.tabItem}`}
                    onClick={() => setSelectedStatus(status.value)}
                >
                    {status.label}
                </button>
            ))}
        </div>
    );
};

export default StatusTabs;
