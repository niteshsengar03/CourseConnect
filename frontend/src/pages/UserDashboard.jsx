import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Layout/Header';
import CourseList from '../components/Course/CourseList';
import Message from '../components/Layout/Message';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const UserDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [availableCourses, setAvailableCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !isAdmin) {
      fetchCourses();
      fetchPurchasedCourses();
    }
  }, [user, isAdmin]);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/course/preview`);
      const data = await response.json();
      if (response.ok) {
        setAvailableCourses(data.courses);
      } else {
        setMessage('Failed to fetch available courses');
      }
    } catch (error) {
      setMessage('An error occurred while fetching courses');
    }
    setLoading(false);
  };

  const fetchPurchasedCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/purchases`, {
        headers: { 'token': user.token },
      });
      const data = await response.json();
      if (response.ok) {
        setPurchasedCourses(data.content);
      } else {
        setMessage('Failed to fetch purchased courses');
      }
    } catch (error) {
      setMessage('An error occurred while fetching purchased courses');
    }
  };

  const handlePurchase = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/course/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': user.token,
        },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Course purchased successfully');
        fetchPurchasedCourses();
      } else {
        setMessage(data.message || 'Failed to purchase course');
      }
    } catch (error) {
      setMessage('An error occurred while purchasing the course');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {message && <Message message={message} />}
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">Available Courses</h2>
          {loading ? (
            <p>Loading courses...</p>
          ) : (
            <CourseList
              courses={availableCourses}
              onPurchase={handlePurchase}
              isAdmin={false}
            />
          )}
        </div>
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900">Your Purchased Courses</h2>
          {loading ? (
            <p>Loading purchased courses...</p>
          ) : (
            <CourseList
              courses={purchasedCourses}
              isAdmin={false}
              isPurchased={true}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;

