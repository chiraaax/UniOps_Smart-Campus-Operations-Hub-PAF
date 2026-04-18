import React, { useState, useEffect, useContext } from 'react';
import { getTicketsForTechnician } from '../../services/incidentService';
import facilityService from '../../services/facilityService';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TechnicianDashboard = () => {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (user && user.email) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [ticketsData, facilitiesData] = await Promise.all([
                getTicketsForTechnician(user.email),
                facilityService.getAllFacilities()
            ]);
            // Sort by priority or recently updated
            ticketsData.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setTickets(ticketsData);
            setFacilities(facilitiesData);
        } catch (error) {
            console.error("Failed to fetch technician dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const getResourceName = (resourceId) => {
        const facility = facilities.find(f => String(f.id) === String(resourceId));
        return facility ? facility.name : resourceId;
    };

    const getStatusColor = (s) => {
        switch(s) {
          case 'OPEN': return 'bg-yellow-100 text-yellow-800';
          case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
          case 'RESOLVED': return 'bg-green-100 text-green-800';
          case 'CLOSED': return 'bg-gray-100 text-gray-800';
          case 'REJECTED': return 'bg-red-100 text-red-800';
          default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-8 text-center text-blue-800 font-bold">Loading Your Dashboard...</div>;

    const activeTickets = tickets.filter(t => t.status !== 'CLOSED' && t.status !== 'REJECTED');
    const closedTickets = tickets.filter(t => t.status === 'CLOSED' || t.status === 'REJECTED');

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <h1 className="text-3xl font-bold text-green-800 mb-2">Welcome, {user.username} (Technician)</h1>
            <p className="text-gray-600 mb-8">Manage the maintenance activities assigned to you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Active Assignments</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{activeTickets.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-l-4 border-gray-500">
                    <h3 className="text-gray-500 text-sm font-bold uppercase">Closed Assignments</h3>
                    <p className="text-4xl font-bold text-gray-800 mt-2">{closedTickets.length}</p>
                </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Assigned Tickets</h2>
            {tickets.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                    You have no tickets currently assigned to you.
                </div>
            ) : (
                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resource</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} onClick={() => navigate(`/incidents/${ticket.id}`)} className="cursor-pointer hover:bg-green-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">...{ticket.id.slice(-6)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getResourceName(ticket.resourceId)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ticket.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{ticket.priority}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TechnicianDashboard;