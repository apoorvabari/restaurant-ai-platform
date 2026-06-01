// New file: filepath: d:\all drive files\restaurant-ai-system\frontend\src\pages\ReservationPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import ReservationForm from "../components/ReservationForm";
import ReservationTracker from "../components/ReservationTracker";

const ReservationPage = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-8">Book Your Table</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <ReservationForm />
          </div>
          <div className="card">
            <ReservationTracker />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;