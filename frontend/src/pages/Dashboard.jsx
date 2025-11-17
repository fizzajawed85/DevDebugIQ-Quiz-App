import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  User,
  Activity,
  TrendingUp,
  Book,
  Award,
  Layers,
  Star,
} from "lucide-react";

const COLORS = [
  "#0ea5e9",
  "#7c3aed",
  "#f97316",
  "#ef4444",
  "#10b981",
  "#facc15",
  "#6366f1",
  "#ec4899",
  "#3b82f6",
  "#f43f5e",
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get("http://localhost:3001/api/user-stats");
        setStats(res.data);
      } catch (e) {
        console.error("Axios Error:", e);
      }
    }
    load();
  }, []);

  if (!stats)
    return (
      <div className="p-8 text-gray-900 dark:text-white min-h-screen">
        Loading...
      </div>
    );

  const pieData = Object.entries(stats.byCategory || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = Object.entries(stats.byCategory || {}).map(([name, value]) => ({
    category: name,
    attempts: value,
  }));

  const topCards = [
    { label: "Users", value: stats.usersCount, icon: <User size={28} />, color: "bg-blue-100 dark:bg-blue-800" },
    { label: "Quiz Attempts", value: stats.attempts, icon: <Activity size={28} />, color: "bg-green-100 dark:bg-green-800" },
    { label: "Active Quizzes", value: stats.activeQuizzes, icon: <TrendingUp size={28} />, color: "bg-purple-100 dark:bg-purple-800" },
    { label: "Avg Attempts/User", value: stats.avgAttemptsPerUser, icon: <Book size={28} />, color: "bg-yellow-100 dark:bg-yellow-800" },
  ];

  const bottomCards = [
    { label: "Top Category", value: stats.topCategory || "N/A", icon: <Award size={24} />, color: "bg-pink-100 dark:bg-pink-800" },
    { label: "Total Categories", value: Object.keys(stats.byCategory).length, icon: <Layers size={24} />, color: "bg-indigo-100 dark:bg-indigo-800" },
    { label: "Most Popular Quiz", value: stats.topCategory || "N/A", icon: <Star size={24} />, color: "bg-orange-100 dark:bg-orange-800" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-32 px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h1
          className="text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Admin Dashboard
        </motion.h1>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {topCards.map((card, idx) => (
            <motion.div
              key={idx}
              className={`p-6 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer transform transition hover:scale-105 ${card.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <div className="p-3 rounded-full bg-white/20">{card.icon}</div>
              <div>
                <div className="text-sm text-gray-700 dark:text-gray-200">{card.label}</div>
                <div className="text-2xl font-bold">{card.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Pie Chart */}
          <motion.div
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-lg font-semibold mb-4">Category Popularity</h2>
            {pieData.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div>No data</div>
            )}
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold mb-4">Attempts by Category</h2>
            {barData.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <XAxis dataKey="category" stroke="#8884d8" />
                  <YAxis stroke="#8884d8" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="attempts">
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div>No data</div>
            )}
          </motion.div>
        </div>

        {/* Bottom Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {bottomCards.map((card, idx) => (
            <motion.div
              key={idx}
              className={`p-6 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer transform transition hover:scale-105 ${card.color}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
            >
              <div className="p-3 rounded-full bg-white/20">{card.icon}</div>
              <div>
                <div className="text-sm text-gray-700 dark:text-gray-200">{card.label}</div>
                <div className="text-xl font-bold">{card.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
