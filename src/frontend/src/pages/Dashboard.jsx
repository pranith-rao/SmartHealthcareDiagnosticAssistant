import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaStethoscope, FaXRay, FaChartLine } from 'react-icons/fa';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const response = await apiService.healthCheck();
      setHealthStatus(response.data);
      toast.success('System is healthy and operational!');
    } catch (error) {
      toast.error('Unable to connect to backend');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Patients', value: '1,247', icon: FaUsers, color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Diagnoses Today', value: '89', icon: FaStethoscope, color: 'from-purple-500 to-purple-600', change: '+8%' },
    { label: 'Imaging Studies', value: '34', icon: FaXRay, color: 'from-teal-500 to-teal-600', change: '+15%' },
    { label: 'Success Rate', value: '96.8%', icon: FaChartLine, color: 'from-green-500 to-green-600', change: '+2.3%' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Healthcare Diagnostic Assistant
        </h1>
        <p className="text-gray-600 text-lg">
          Powered by AI-driven medical decision support • Team CursorMinds
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-xl p-6 cursor-pointer"
            >
              {/* Gradient Background */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full transform translate-x-10 -translate-y-10`}></div>
              
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} mb-4`}>
                <Icon className="text-white text-2xl" />
              </div>

              {/* Stats */}
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</p>
                <div className="flex items-center">
                  <span className="text-green-500 text-sm font-semibold">{stat.change}</span>
                  <span className="text-gray-400 text-xs ml-2">vs last month</span>
                </div>
              </div>

              {/* Animated border */}
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></span>
          System Status
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthStatus?.services && Object.entries(healthStatus.services).map(([service, status], index) => (
              <motion.div
                key={service}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 * index, type: 'spring' }}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-800 capitalize">{service.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-gray-500 capitalize">{status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { title: 'New Patient', desc: 'Register a new patient', gradient: 'from-blue-500 to-cyan-500', link: '/patients' },
          { title: 'Diagnose', desc: 'Run diagnostic analysis', gradient: 'from-purple-500 to-pink-500', link: '/diagnosis' },
          { title: 'Imaging', desc: 'Analyze medical images', gradient: 'from-teal-500 to-green-500', link: '/imaging' },
        ].map((action, index) => (
          <Link key={index} to={action.link}>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${action.gradient} p-6 text-white cursor-pointer shadow-xl`}
            >
            <h3 className="text-xl font-bold mb-2">{action.title}</h3>
            <p className="text-white text-opacity-90 mb-4">{action.desc}</p>
            <div className="flex items-center text-sm font-semibold">
              <span>Get Started</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* Animated circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
          </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
};

export default Dashboard;

