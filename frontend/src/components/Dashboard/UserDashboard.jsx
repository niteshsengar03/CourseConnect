import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import CourseList from '../Course/CourseList';
import Message from '../Layout/Message';

const UserDashboard = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [message, setMessage] = useState('');
  const { request, loading, error } = useApi();

  useEffect(() => {
    fetchCourses();
    fetchPurchasedCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await request('/course/preview', 'GET');
      setAvailableCourses(data.courses);
    } catch (err) {
      setMessage('Failed to fetch available courses');
    }
  };

  const fetchPurchasedCourses = async () => {
    try {
      const data = await request('/user/purchases', 'GET');
      setPurchasedCourses(data.content);
    } catch (err) {
      setMessage('Failed to fetch purchased courses');
    }
  };

  const handlePurchase = async (courseId) => {
    try {
      await request('/course/purchase', 'POST', { courseId });
      setMessage('Course purchased successfully');
      fetchPurchasedCourses();
    } catch (err) {
      setMessage('Failed to purchase course');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {message && <Message message={message} type={error ? 'error' : 'info'} />}
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
    </div>
  );
};

export default UserDashboard;

