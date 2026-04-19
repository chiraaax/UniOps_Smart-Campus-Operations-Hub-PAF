import React, { useState, useEffect } from 'react';

const SLATimer = ({ ticket }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update the timer every 60 seconds, but only if it's not resolved yet
    useEffect(() => {
        if (!ticket.resolvedAt) {
            const timer = setInterval(() => setCurrentTime(new Date()), 60000); 
            return () => clearInterval(timer);
        }
    }, [ticket.resolvedAt]);

    const calculateDuration = (startTime, endTime) => {
        if (!startTime) return "N/A";
        const start = new Date(startTime);
        const end = endTime ? new Date(endTime) : currentTime;
        
        const diffMs = Math.abs(end - start);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffDays > 0) return `${diffDays}d ${diffHrs}h`;
        if (diffHrs > 0) return `${diffHrs}h ${diffMins}m`;
        return `${diffMins}m`;
    };

    const ttfr = calculateDuration(ticket.createdAt, ticket.firstRespondedAt);
    const ttr = calculateDuration(ticket.createdAt, ticket.resolvedAt);

    // Overdue logic: Critical ticket > 4 hours without resolution
    const isOverdue = ticket.priority === 'CRITICAL' && !ticket.resolvedAt && (new Date() - new Date(ticket.createdAt)) > (4 * 60 * 60 * 1000); 

    return (
        <div style={{ 
            display: 'flex', 
            gap: '15px', 
            backgroundColor: isOverdue ? '#fff3cd' : '#f8f9fa', 
            padding: '10px 15px', 
            borderRadius: '8px', 
            border: `1px solid ${isOverdue ? '#ffecb5' : '#e9ecef'}`, 
            fontSize: '13px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <div>
                <span style={{ color: '#6c757d', fontWeight: 'bold', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Time to First Response</span>
                <span style={{ color: ticket.firstRespondedAt ? '#198754' : '#fd7e14', fontWeight: 'bold' }}>
                    {ticket.firstRespondedAt ? `✅ ${ttfr}` : `⏱️ ${ttfr}`}
                </span>
            </div>
            
            <div style={{ borderLeft: '1px solid #dee2e6', paddingLeft: '15px' }}>
                <span style={{ color: '#6c757d', fontWeight: 'bold', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Time to Resolution</span>
                <span style={{ color: ticket.resolvedAt ? '#198754' : isOverdue ? '#dc3545' : '#0d6efd', fontWeight: 'bold' }}>
                    {ticket.resolvedAt ? `✅ ${ttr}` : `⏳ ${ttr}`}
                </span>
            </div>
        </div>
    );
};

export default SLATimer;