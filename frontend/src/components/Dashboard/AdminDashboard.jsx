import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import CourseList from '../Course/CourseList';
import CourseForm from '../Course/CourseForm';
import Message from '../Layout/Message';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const { request, loading, error } = useApi();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await request('/admin/course/bulk', 'GET');
      setCourses(data.courses);
    } catch (err) {
      setMessage('Failed to fetch courses');
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      await request('/admin/course', 'POST', courseData);
      setMessage('Course created successfully');
      fetchCourses();
    } catch (err) {
      setMessage('Failed to create course');
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      await request('/admin/course', 'PUT', { courseId, ...courseData });
      setMessage('Course updated successfully');
      fetchCourses();
    } catch (err) {
      setMessage('Failed to update course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await request('/admin/course', 'DELETE', { courseId });
      setMessage('Course deleted successfully');
      fetchCourses();
    } catch (err) {
      setMessage('Failed to delete course');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {message && <Message message={message} type={error ? 'error' : 'info'} />}
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-2xl font-semibold text-gray-900">Create New Course</h2>
        <CourseForm onSubmit={handleCreateCourse} />
      </div>
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-2xl font-semibold text-gray-900">Your Courses</h2>
        {loading ? (
          <p>Loading courses...</p>
        ) : (
          <CourseList
            courses={courses}
            onUpdate={handleUpdateCourse}
            onDelete={handleDeleteCourse}
            isAdmin={true}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

