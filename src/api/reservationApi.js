import axios from './axiosConfig';

export const fetchReservations = () => axios.get('/reservations');
export const createReservation = payload => axios.post('/reservations', payload);
