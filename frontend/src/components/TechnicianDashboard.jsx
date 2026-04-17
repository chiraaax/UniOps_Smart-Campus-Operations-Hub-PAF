import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TechnicianDashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const user = userStr ? JSON.parse(userStr) : null;

    const axiosConfig = useMemo(() => ({
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }), [token]);

    const fetchTasks = useCallback(async () => {
        if (!user || !user.id) return;
        try {
            const res = await axios.get(`http://localhost:8080/api/technician/tasks/${user.id}`, axiosConfig);
            setTasks(res.data);
        } catch (err) {
            console.error("Error fetching technician tasks", err);
            if (err.response?.status === 403) {
                alert("Unauthorized: Technician access required");
                navigate("/signin");
            }
        } finally {
            setLoading(false);
        }
    }, [user, axiosConfig, navigate]);

    useEffect(() => {
        // Check if user is authorized
        if (!user || !token) {
            navigate("/signin");
            return;
        }

        if (user.role !== "TECHNICIAN" && user.role !== "ADMIN") {
            alert("Unauthorized: Technician access required");
            navigate("/dashboard");
            return;
        }

        fetchTasks();
    }, [user, token, fetchTasks, navigate]);

    const handleComplete = async (taskId) => {
        try {
            await axios.put(`http://localhost:8080/api/technician/complete/${taskId}`, {}, axiosConfig);
            fetchTasks();
            alert("Task marked as completed!");
        } catch (err) {
            if (err.response?.status === 403) {
                alert("Unauthorized: Cannot complete this task");
            } else {
                alert("Error updating task");
            }
        }
    };

    if (!user || (user.role !== "TECHNICIAN" && user.role !== "ADMIN")) {
        return <div className="p-10 text-center text-red-600 font-semibold">Access Denied: Technician access required</div>;
    }
    if (loading) return <div className="p-10 text-center">Loading Tasks...</div>;

    return (
        <div className="p-8 pt-24 bg-white min-h-screen">
            {user.status === "PENDING" && (
                <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg font-medium">
                    ⚠️ Your account is pending administrator approval. You can use the dashboard but will have full access once approved.
                </div>
            )}
            
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Technician Dashboard</h1>
            <p className="mb-4 text-gray-600">Welcome, {user.name}. Here are your assigned tasks.</p>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map(task => (
                    <div key={task.id} className="border rounded-xl p-6 shadow-sm bg-white hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {task.resourceId}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-medium ${
                                task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                                {task.status}
                            </span>
                        </div>
                        <p className="text-gray-700 mb-6">{task.issueDescription}</p>
                        
                        {task.status !== 'COMPLETED' && (
                            <button 
                                onClick={() => handleComplete(task.id)}
                                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium"
                            >
                                Mark as Completed
                            </button>
                        )}
                    </div>
                ))}
            </div>
            {tasks.length === 0 && <p className="text-center text-gray-500 py-10">No tasks assigned to you yet.</p>}
        </div>
    );
};

export default TechnicianDashboard;
