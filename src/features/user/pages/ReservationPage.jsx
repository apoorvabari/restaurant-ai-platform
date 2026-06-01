import React from 'react';
import ReservationForm from '../../../components/ReservationForm';
import ReservationList from '../../../components/ReservationList';

export default function ReservationPage() {
  // Simple wrapper that shows the form and then the list
  // After a successful reservation, the form will trigger a refresh via Redux state in the existing app.
  // We just render both components; the form handles its own success overlay.
  return (
    <section className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-amber-100 mb-6 text-center">Book a Table</h1>
      <ReservationForm onSuccess={() => { /* optional: could trigger a Redux action to refresh list */ }} />
      <hr className="my-8 border-amber-700" />
      <ReservationList />
    </section>
  );
}
