import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Layout/Header';
import CourseList from '../components/Course/CourseList';
import CourseForm from '../components/Course/CourseForm';
import Message from '../components/Layout/Message';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCourses();
    }
  }, [user, isAdmin]);

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!isAdmin) {
    return <Navigate to="/user" />;
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/course/bulk`, {
        headers: { 'token': user.token },
      });
      const data = await response.json();
      if (response.ok) {
        setCourses(data.courses);
      } else {
        setMessage('Failed to fetch courses');
      }
    } catch (error) {
      setMessage('An error occurred while fetching courses');
    }
    setLoading(false);
  };

  const handleCreateCourse = async (courseData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': user.token,
        },
        body: JSON.stringify(courseData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Course created successfully');
        fetchCourses();
      } else {
        setMessage(data.message || 'Failed to create course');
      }
    } catch (error) {
      setMessage('An error occurred while creating the course');
    }
  };

  const handleUpdateCourse = async (courseId, courseData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/course`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': user.token,
        },
        body: JSON.stringify({ courseId, ...courseData }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Course updated successfully');
        fetchCourses();
      } else {
        setMessage(data.message || 'Failed to update course');
      }
    } catch (error) {
      setMessage('An error occurred while updating the course');
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/course`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': user.token,
        },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Course deleted successfully');
        fetchCourses();
      } else {
        setMessage(data.message || 'Failed to delete course');
      }
    } catch (error) {
      setMessage('An error occurred while deleting the course');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {message && <Message message={message} />}
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
      </main>
    </div>
  );
};

export default AdminDashboard;

