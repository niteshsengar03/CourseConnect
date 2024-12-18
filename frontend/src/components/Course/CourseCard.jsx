import React, { useState } from 'react';
import CourseForm from './CourseForm';

const CourseCard = ({ course, onUpdate, onDelete, onPurchase, isAdmin, isPurchased }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = (updatedCourse) => {
    onUpdate(course._id, updatedCourse);
    setIsEditing(false);
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      {isEditing ? (
        <CourseForm course={course} onSubmit={handleUpdate} onCancel={() => setIsEditing(false)} />
      ) : (
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{course.title}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">{course.description}</p>
          <img src={course.imageUrl} alt={course.title} className="mt-2 w-full h-48 object-cover" />
          <p className="mt-2 text-sm text-gray-500">Price: ${course.price}</p>
          {isAdmin && (
            <div className="mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="mr-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(course._id)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          )}
          {!isAdmin && !isPurchased && (
            <button
              onClick={() => onPurchase(course._id)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Purchase
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseCard;

