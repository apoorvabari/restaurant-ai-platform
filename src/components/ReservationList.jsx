import React, { useEffect, useState } from 'react';
import { fetchReservations } from '../api/reservationApi';

export default function ReservationList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchReservations()
      .then(res => setList(res.data))
      .catch(err => console.error('Failed to load reservations', err));
  }, []);

  return (
    <section className="reservation-section">
      <h2 className="title">Your Reservations</h2>
      {list.length === 0 ? (
        <p>No reservations yet.</p>
      ) : (
        <ul className="reservation-list">
          {list.map(r => (
            <li key={r.id}>
              <strong>{r.customerName}</strong> – {new Date(r.reservationTime).toLocaleString()} – Party of {r.partySize}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
