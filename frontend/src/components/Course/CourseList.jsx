import React from 'react';
import CourseCard from './CourseCard';

const CourseList = ({ courses, onUpdate, onDelete, onPurchase, isAdmin, isPurchased }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          course={course}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onPurchase={onPurchase}
          isAdmin={isAdmin}
          isPurchased={isPurchased}
        />
      ))}
    </div>
  );
};

export default CourseList;

