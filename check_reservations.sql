-- Query to check all reservations in the database
SELECT 
    id,
    customer_name,
    phone_number,
    number_of_guests,
    reservation_date,
    reservation_time,
    status,
    table_id,
    duration_hours,
    special_request,
    user_id,
    deleted
FROM restaurant_db.reservations
ORDER BY reservation_date DESC, reservation_time DESC;

-- Query to check which tables are currently booked (non-cancelled, non-deleted)
SELECT 
    r.id,
    r.customer_name,
    r.table_id,
    dt.table_number,
    r.reservation_date,
    r.reservation_time,
    r.status,
    r.duration_hours,
    r.deleted
FROM restaurant_db.reservations r
LEFT JOIN restaurant_db.dining_tables dt ON r.table_id = dt.id
WHERE r.deleted = false 
AND r.status NOT IN ('CANCELLED', 'EXPIRED', 'NO_SHOW')
ORDER BY r.table_id, r.reservation_date, r.reservation_time;

-- Query to check table statuses
SELECT 
    id,
    table_number,
    capacity,
    status,
    deleted
FROM restaurant_db.dining_tables
ORDER BY table_number;
