"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function AdminPage() {
  const { userId } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userGrowth, setUserGrowth] = useState<{ date: string; totalUsers: number }[]>([]);

  useEffect(() => {
    async function fetchUserRole() {
      if (!userId) return;
      try {
        const res = await fetch(`/api/auth/user-role`);
        const data = await res.json();
        if (data.role !== "admin") {
          router.push("/"); // Redirect if not an admin
        } else {
          setUserRole("admin");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    }

    fetchUserRole();
  }, [userId, router]);

  useEffect(() => {
    if (userRole !== "admin") return;

    async function fetchData() {
      setLoading(true);
      try {
        const [usersRes, growthRes] = await Promise.all([
          fetch("/api/admin/users"),
          fetch("/api/admin/user-growth"),
        ]);

        const usersData = await usersRes.json();
        const growthData = await growthRes.json();

        setUsers(usersData);
        setUserGrowth(growthData);
      } catch (error) {
        console.error("Error fetching users or growth statistics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userRole]);

  if (loading) return <p>Loading users...</p>;
  if (userRole !== "admin") return <p>Redirecting...</p>;

  // Chart Data for User Growth Over Time
  const lineChartData = {
    labels: userGrowth.map((entry) => entry.date), // Dates as labels
    datasets: [
      {
        label: "Total Users Over Time",
        data: userGrowth.map((entry) => entry.totalUsers), // Cumulative total
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  async function changeRole(userId: string, newRole: string) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
        headers: { "Content-Type": "application/json" },
      });
  
      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      } else {
        console.error("Error updating role:", await res.json());
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
  
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
  
      if (res.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      } else {
        console.error("Error deleting user:", await res.json());
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* ✅ Display User Growth Chart */}
      <div className="mb-4 p-4 bg-gray-100 border border-gray-300 rounded">
        <h2 className="text-lg font-semibold mb-2">User Growth Over Time</h2>
        <Line data={lineChartData} options={chartOptions} />
      </div>

      <table className="w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-black text-white">
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border">
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user.id, e.target.value)}
                  className="border p-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2">
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}