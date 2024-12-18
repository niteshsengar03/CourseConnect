import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:3000/api/v1';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
      if (isAdmin) {
        fetchAdminCourses();
      } else {
        fetchCourses();
        fetchPurchasedCourses();
      }
    }
  }, [isLoggedIn, isAdmin]);

  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogin = async (e, isAdmin) => {
    e.preventDefault();
    let email, password;
    if (e.target.tagName === 'FORM') {
      email = e.target.email.value;
      password = e.target.password.value;
    } else {
      email = document.querySelector('input[name="email"]').value;
      password = document.querySelector('input[name="password"]').value;
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/${isAdmin ? 'admin' : 'user'}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('isAdmin', isAdmin.toString());
        setIsLoggedIn(true);
        setIsAdmin(isAdmin);
        showMessage(`Welcome back, ${isAdmin ? 'Admin' : 'User'}!`);
      } else {
        showMessage(data.message || 'Login failed. Please try again.', true);
      }
    } catch (error) {
      console.error('Login error:', error);
      showMessage('An error occurred. Please try again.', true);
    }
  };

  const handleSignup = async (e, isAdmin) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    try {
      const response = await fetch(`${API_BASE_URL}/${isAdmin ? 'admin' : 'user'}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Signup successful. You can now log in.');
      } else {
        showMessage(data.message, true);
      }
    } catch (error) {
      showMessage('An error occurred. Please try again.', true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/course/preview`);
      const data = await response.json();
      if (response.ok) {
        setCourses(data.courses);
      }
    } catch (error) {
      showMessage('Failed to fetch courses.', true);
    }
  };

  const fetchPurchasedCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/purchases`, {
        headers: { 'token': localStorage.getItem('token') },
      });
      const data = await response.json();
      if (response.ok) {
        setPurchasedCourses(data.content);
      }
    } catch (error) {
      showMessage('Failed to fetch purchased courses.', true);
    }
  };

  const fetchAdminCourses = async () => {
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/course/bulk`, {
        headers: { 'token': localStorage.getItem('token') },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch admin courses');
      }
      const data = await response.json();
      setCourses(data.courses);
    } catch (error) {
      console.error('Fetch admin courses error:', error);
      showMessage('Failed to fetch admin courses.', true);
    }
  };

  const handlePurchase = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/course/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Course purchased successfully.');
        fetchPurchasedCourses();
      } else {
        showMessage(data.message, true);
      }
    } catch (error) {
      showMessage('An error occurred. Please try again.', true);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const imageUrl = e.target.imageUrl.value;
    const price = parseFloat(e.target.price.value);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ title, description, imageUrl, price }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Course created successfully.');
        fetchAdminCourses();
      } else {
        showMessage(data.message, true);
      }
    } catch (error) {
      showMessage('An error occurred. Please try again.', true);
    }
  };

  const handleUpdateCourse = async (e, courseId) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    const imageUrl = e.target.imageUrl.value;
    const price = parseFloat(e.target.price.value);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/course`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ courseId, title, description, imageUrl, price }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Course updated successfully.');
        fetchAdminCourses();
      } else {
        showMessage(data.message, true);
      }
    } catch (error) {
      showMessage('An error occurred. Please try again.', true);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/course`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token'),
        },
        body: JSON.stringify({ courseId }),
      });
      const data = await response.json();
      if (response.ok) {
        showMessage('Course deleted successfully.');
        fetchAdminCourses();
      } else {
        showMessage(data.message, true);
      }
    } catch (error) {
      showMessage('An error occurred. Please try again.', true);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="container">
        <h1>Course Management System</h1>
        {message && (
          <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
        <div className="auth-container">
          <div className="auth-form">
            <h2>Login</h2>
            <form onSubmit={(e) => handleLogin(e, false)}>
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Login as User</button>
            </form>
            <button onClick={(e) => handleLogin(e, true)}>Login as Admin</button>
          </div>
          <div className="auth-form">
            <h2>Signup</h2>
            <form onSubmit={(e) => handleSignup(e, false)}>
              <input type="text" name="firstName" placeholder="First Name" required />
              <input type="text" name="lastName" placeholder="Last Name" required />
              <input type="email" name="email" placeholder="Email" required />
              <input type="password" name="password" placeholder="Password" required />
              <button type="submit">Signup as User</button>
            </form>
            <button onClick={(e) => handleSignup(e, true)}>Signup as Admin</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>{isAdmin ? 'Admin Dashboard' : 'User Dashboard'}</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {message && (
        <div className={`message ${message.includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
      {isAdmin ? (
        <div>
          <h2>Your Courses</h2>
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <img src={course.imageUrl} alt={course.title} />
                <p>Price: ${course.price}</p>
                <form onSubmit={(e) => handleUpdateCourse(e, course._id)}>
                  <input name="title" defaultValue={course.title} placeholder="Title" required />
                  <input name="description" defaultValue={course.description} placeholder="Description" required />
                  <input name="imageUrl" defaultValue={course.imageUrl} placeholder="Image URL" required />
                  <input name="price" defaultValue={course.price} type="number" step="0.01" placeholder="Price" required />
                  <button type="submit">Update</button>
                </form>
                <button onClick={() => handleDeleteCourse(course._id)}>Delete</button>
              </div>
            ))}
          </div>
          <h2>Create New Course</h2>
          <form onSubmit={handleCreateCourse} className="create-course-form">
            <input name="title" placeholder="Title" required />
            <input name="description" placeholder="Description" required />
            <input name="imageUrl" placeholder="Image URL" required />
            <input name="price" type="number" step="0.01" placeholder="Price" required />
            <button type="submit">Create Course</button>
          </form>
        </div>
      ) : (
        <div>
          <h2>Available Courses</h2>
          <div className="course-grid">
            {courses.map((course) => (
              <div key={course._id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <img src={course.imageUrl} alt={course.title} />
                <p>Price: ${course.price}</p>
                <button onClick={() => handlePurchase(course._id)}>Purchase</button>
              </div>
            ))}
          </div>
          <h2>Your Purchased Courses</h2>
          <div className="course-grid">
            {purchasedCourses.map((course) => (
              <div key={course._id} className="course-card">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <img src={course.imageUrl} alt={course.title} />
                <p>Price: ${course.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

