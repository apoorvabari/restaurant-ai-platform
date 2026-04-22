-- Query to clean up old past reservations (mark them as deleted or change status)
-- Option 1: Mark past reservations as deleted
UPDATE restaurant_db.reservations 
SET deleted = true 
WHERE reservation_date < CURDATE() AND status = 'BOOKED';

-- Option 2: Change status of past reservations to EXPIRED
UPDATE restaurant_db.reservations 
SET status = 'EXPIRED' 
WHERE reservation_date < CURDATE() AND status = 'BOOKED';

-- Option 3: Reset table statuses to AVAILABLE for tables with only past reservations
UPDATE restaurant_db.dining_tables dt
SET status = 'AVAILABLE'
WHERE dt.id IN (
    SELECT DISTINCT r.table_id 
    FROM restaurant_db.reservations r 
    WHERE r.table_id = dt.id 
    AND r.reservation_date < CURDATE()
    AND r.status = 'BOOKED'
)
AND NOT EXISTS (
    SELECT 1 
    FROM restaurant_db.reservations r2 
    WHERE r2.table_id = dt.id 
    AND r2.reservation_date >= CURDATE()
    AND r2.status NOT IN ('CANCELLED', 'EXPIRED', 'NO_SHOW')
    AND r2.deleted = false
);

-- Check current table statuses after cleanup
SELECT id, table_number, capacity, status, deleted
FROM restaurant_db.dining_tables
ORDER BY table_number;
