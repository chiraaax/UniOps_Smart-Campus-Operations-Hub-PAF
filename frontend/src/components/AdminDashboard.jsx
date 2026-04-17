import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Users } from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [pendingTechs, setPendingTechs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        // Check if user is logged in and is an ADMIN
        if (!user || !token) {
            navigate("/signin");
            return;
        }

        const parsedUser = JSON.parse(user);
        if (parsedUser.role !== "ADMIN") {
            alert("Unauthorized: You do not have admin access");
            navigate("/dashboard");
            return;
        }

        setIsAuthorized(true);
        fetchData(token);
    }, [navigate]);

    const fetchData = async (token) => {
        setLoading(true);
        const axiosConfig = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        try {
            console.log("Fetching pending technicians...");
            const pendingRes = await axios.get("http://localhost:8080/api/admin/pending-technicians", axiosConfig);
            console.log("Pending technicians response:", pendingRes.data);
            setPendingTechs(pendingRes.data || []);
            setErrors(prev => ({ ...prev, pending: null }));
        } catch (err) {
            console.error("Error fetching pending technicians:", err.message, err.response);
            if (err.response?.status === 403) {
                setErrors(prev => ({ ...prev, pending: "Unauthorized: Admin access required" }));
            } else {
                setErrors(prev => ({ ...prev, pending: err.message }));
            }
        }

        try {
            console.log("Fetching pending tasks...");
            const tasksRes = await axios.get("http://localhost:8080/api/admin/pending-tasks", axiosConfig);
            console.log("Pending tasks response:", tasksRes.data);
            setTasks(tasksRes.data || []);
            setErrors(prev => ({ ...prev, tasks: null }));
        } catch (err) {
            console.error("Error fetching pending tasks:", err.message, err.response);
            if (err.response?.status === 403) {
                setErrors(prev => ({ ...prev, tasks: "Unauthorized: Admin access required" }));
            } else {
                setErrors(prev => ({ ...prev, tasks: err.message }));
            }
        }

        try {
            console.log("Fetching technicians...");
            const techsRes = await axios.get("http://localhost:8080/api/admin/technicians", axiosConfig);
            console.log("Technicians response:", techsRes.data);
            setTechnicians(techsRes.data || []);
            setErrors(prev => ({ ...prev, technicians: null }));
        } catch (err) {
            console.error("Error fetching technicians:", err.message, err.response);
            if (err.response?.status === 403) {
                setErrors(prev => ({ ...prev, technicians: "Unauthorized: Admin access required" }));
            } else {
                setErrors(prev => ({ ...prev, technicians: err.message }));
            }
        }

        setLoading(false);
    };

    const handleTechAction = async (id, action) => {
        const token = localStorage.getItem("token");
        const axiosConfig = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        try {
            console.log(`${action}-tech/${id}`);
            await axios.put(`http://localhost:8080/api/admin/${action}-tech/${id}`, {}, axiosConfig);
            fetchData(token);
            alert(`Technician ${action === 'approve' ? 'Approved' : 'Rejected'}`);
        } catch (err) {
            console.error(`Error ${action} technician:`, err);
            if (err.response?.status === 403) {
                alert("Unauthorized: Admin access required");
            } else {
                alert(`Error updating technician status: ${err.message}`);
            }
        }
    };

    const handleAction = async (id, action) => {
        const token = localStorage.getItem("token");
        const axiosConfig = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        try {
            await axios.put(`http://localhost:8080/api/admin/${action}/${id}`, {}, axiosConfig);
            fetchData(token);
        } catch (err) {
            alert(`Error performing ${action}`);
        }
    };

    const handleAssign = async (taskId, technicianId) => {
        if (!technicianId) return;
        const token = localStorage.getItem("token");
        const axiosConfig = {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        try {
            await axios.put(`http://localhost:8080/api/admin/assign/${taskId}/${technicianId}`, {}, axiosConfig);
            fetchData(token);
        } catch (err) {
            alert("Error assigning technician");
        }
    };

    if (!isAuthorized) {
        return <div className="p-10 text-center">Checking authorization...</div>;
    }

    if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

    return (
        <div className="p-8 pt-24 bg-white min-h-screen max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Command Center</h1>
            
            {/* Error Messages */}
            {errors.pending && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errors.pending}</div>}
            {errors.tasks && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errors.tasks}</div>}
            {errors.technicians && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errors.technicians}</div>}
            
            {/* Pending Technicians Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-10 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-700">
                    <Users className="w-5 h-5" /> Pending Technician Approvals ({pendingTechs.length})
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
                                    <th className="p-3 text-sm font-semibold text-gray-600">ID</th>
                                    <th className="p-3 text-sm font-semibold text-gray-600 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingTechs.map(tech => (
                                    <tr key={tech.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium text-gray-800">{tech.name}</td>
                                        <td className="p-3 text-gray-600">{tech.email}</td>
                                        <td className="p-3 text-gray-500 text-xs">{tech.id}</td>
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
