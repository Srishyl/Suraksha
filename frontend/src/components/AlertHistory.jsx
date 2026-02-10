import React from 'react';
import { FaExclamationTriangle, FaExclamationCircle, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';

const AlertHistory = ({ alerts }) => {
    if (!alerts || alerts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-purple-200">No alerts found. Stay safe!</p>
            </div>
        );
    }

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="space-y-4">
            {alerts.map((alert) => {
                let alertClass = 'border-yellow-500';
                let Icon = FaInfoCircle;
                let alertColor = 'text-yellow-500';

                if (alert.risk_level === 'high risk') {
                    alertClass = 'border-red-500';
                    Icon = FaExclamationTriangle;
                    alertColor = 'text-red-500';
                } else if (alert.risk_level === 'risky') {
                    alertClass = 'border-orange-500';
                    Icon = FaExclamationCircle;
                    alertColor = 'text-orange-500';
                }

                return (
                    <div key={alert.id} className={`bg-black/20 backdrop-blur-md rounded-xl p-4 border-l-4 ${alertClass}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <Icon className={`${alertColor} text-xl mr-3`} />
                                <div>
                                    <h4 className="font-bold text-white">{capitalizeFirstLetter(alert.risk_level)} Alert</h4>
                                    <p className="text-sm text-gray-400">{new Date(alert.timestamp).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="bg-black/30 px-3 py-1 rounded-full text-xs text-purple-200">
                                {alert.status || 'Sent'}
                            </div>
                        </div>
                        {(alert.latitude !== 0 || alert.longitude !== 0) && (
                            <div className="mt-3 text-sm text-purple-200 flex items-center">
                                <FaMapMarkerAlt className="mr-1" /> Location shared
                            </div>
                        )}
                        {alert.actions_taken && alert.actions_taken.length > 0 && (
                            <div className="mt-2 text-xs text-gray-400">
                                {alert.actions_taken.join(', ')}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default AlertHistory;
