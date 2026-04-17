import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users } from "lucide-react";

const AdminDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [pendingTechs, setPendingTechs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        fetchPendingTechs();
    }, []);

    const fetchData = async () => {
        try {
            const tasksRes = await axios.get("http://localhost:8080/api/admin/pending-tasks");
            const techsRes = await axios.get("http://localhost:8080/api/admin/technicians");
            setTasks(tasksRes.data);
            setTechnicians(techsRes.data);
        } catch (err) {
            console.error("Error fetching admin data", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingTechs = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/admin/pending-technicians");
            setPendingTechs(res.data);
        } catch (err) {
            console.error("Error fetching pending techs", err);
        }
    };

    const handleTechAction = async (id, action) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/${action}-tech/${id}`);
            fetchPendingTechs();
            fetchData(); // Refresh approved techs list
            alert(`Technician ${action === 'approve' ? 'Approved' : 'Rejected'}`);
        } catch (err) {
            alert("Error updating technician status");
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/${action}/${id}`);
            fetchData();
        } catch (err) {
            alert(`Error performing ${action}`);
        }
    };

    const handleAssign = async (taskId, technicianId) => {
        if (!technicianId) return;
        try {
            await axios.put(`http://localhost:8080/api/admin/assign/${taskId}/${technicianId}`);
            fetchData();
        } catch (err) {
            alert("Error assigning technician");
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

    return (
        <div className="p-8 pt-24 bg-white min-h-screen max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Command Center</h1>
            
            {/* Pending Technicians Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
                    <Users className="w-5 h-5" /> Pending Technician Approvals
                </h2>
                {pendingTechs.length === 0 ? (
                    <p className="text-gray-500 italic">No technician registrations awaiting approval.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 text-sm font-semibold text-gray-600">Name</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600">Email</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTechs.map(tech => (
                                    <tr key={tech.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-800">{tech.name}</td>
                                        <td className="p-3 text-gray-600">{tech.email}</td>
                                        <td className="p-3 flex justify-center gap-3">
                                            <button 
                                                onClick={() => handleTechAction(tech.id, 'approve')}
                                                className="bg-green-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition shadow-sm"
                                            >
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleTechAction(tech.id, 'reject')}
                                                className="bg-red-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-red-700 transition shadow-sm"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                Resource Maintenance Requests
            </h2>
            <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-100">
                <table className="w-full text-left bg-white">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <tr>
                            <th className="px-6 py-3">Resource ID</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                            <th className="px-6 py-3">Assign Technician</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {tasks.map(task => (
                            <tr key={task.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">{task.resourceId}</td>
                                <td className="px-6 py-4">{task.issueDescription}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                                        {task.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    <button 
                                        onClick={() => handleAction(task.id, 'approve')}
                                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleAction(task.id, 'reject')}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                    >
                                        Reject
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        onChange={(e) => handleAssign(task.id, e.target.value)}
                                        className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select Technician</option>
                                        {technicians.map(tech => (
                                            <option key={tech.id} value={tech.id}>{tech.name}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {tasks.length === 0 && <p className="p-6 text-center text-gray-500">No pending tasks found.</p>}
            </div>
        </div>
    );
};

export default AdminDashboard;
