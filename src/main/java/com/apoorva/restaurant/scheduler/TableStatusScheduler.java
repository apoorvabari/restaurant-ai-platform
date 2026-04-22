package com.apoorva.restaurant.scheduler;

import com.apoorva.restaurant.entity.DiningTable;
import com.apoorva.restaurant.entity.Reservation;
import com.apoorva.restaurant.entity.Reservation.ReservationStatus;
import com.apoorva.restaurant.repository.ReservationRepository;
import com.apoorva.restaurant.repository.TableRepository;
import com.apoorva.restaurant.service.TableService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
public class TableStatusScheduler {

    private static final Logger logger = LoggerFactory.getLogger(TableStatusScheduler.class);

    private final ReservationRepository reservationRepository;
    private final TableRepository tableRepository;
    private final TableService tableService;

    public TableStatusScheduler(ReservationRepository reservationRepository,
                                 TableRepository tableRepository,
                                 TableService tableService) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
        this.tableService = tableService;
    }

    // Run every 1 minute for near real-time status updates
    @Scheduled(fixedRate = 60000) // 1 minute
    @Transactional
    @SuppressWarnings("all")
    public void updateTableStatusesBasedOnTiming() {
        logger.info("Starting scheduled table status update...");

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Get all active reservations for today (including ON_GOING to handle completions)
        List<Reservation> todayReservations = reservationRepository.findByDeletedFalse().stream()
                .filter(r -> r.getReservationDate().isEqual(today))
                .filter(r -> r.getTableId() != null)
                .filter(r -> r.getStatus() == ReservationStatus.BOOKED || 
                           r.getStatus() == ReservationStatus.CONFIRMED || 
                           r.getStatus() == ReservationStatus.ON_GOING)
                .toList();

        logger.info("Found {} active reservations for today to process", todayReservations.size());

        for (Reservation reservation : todayReservations) {
            try {
                DiningTable table = tableRepository.findById(reservation.getTableId()).orElse(null);
                if (table == null || table.isDeleted()) {
                    logger.warn("Skipping reservation {} - table not found or deleted", reservation.getId());
                    continue;
                }

                LocalTime reservationTime = reservation.getReservationTime();
                Integer durationHours = reservation.getDurationHours() != null ? reservation.getDurationHours() : 2;
                LocalTime endTime = reservationTime.plusHours(durationHours);

                logger.debug("Processing reservation {} - Status: {}, Time: {}, EndTime: {}, Now: {}", 
                    reservation.getId(), reservation.getStatus(), reservationTime, endTime, now);

                // Logic 0: If reservation time has arrived, change BOOKED/CONFIRMED to ON_GOING
                if ((now.isAfter(reservationTime) || now.equals(reservationTime)) && 
                    (reservation.getStatus() == ReservationStatus.BOOKED || reservation.getStatus() == ReservationStatus.CONFIRMED)) {
                    logger.info("Updating reservation {} status from {} to ON_GOING (reservation time arrived at {})", 
                        reservation.getId(), reservation.getStatus(), reservationTime);
                    reservation.setStatus(ReservationStatus.ON_GOING);
                    reservationRepository.save(reservation);
                }

                // Logic 1: If reservation time has arrived, change BOOKED to OCCUPIED
                if (now.isAfter(reservationTime) && now.isBefore(endTime) 
                    && table.getStatus() == DiningTable.TableStatus.BOOKED) {
                    logger.info("Updating table {} to OCCUPIED (reservation time arrived)", table.getTableNumber());
                    tableService.updateTableStatus(table.getId(), DiningTable.TableStatus.OCCUPIED);
                }

                // Logic 2: If reservation duration has passed, change OCCUPIED to AVAILABLE
                if (now.isAfter(endTime) && table.getStatus() == DiningTable.TableStatus.OCCUPIED) {
                    logger.info("Updating table {} to AVAILABLE (reservation duration expired)", table.getTableNumber());
                    tableService.updateTableStatus(table.getId(), DiningTable.TableStatus.AVAILABLE);
                    
                    // Also update reservation status to COMPLETED
                    if (reservation.getStatus() == ReservationStatus.ON_GOING || 
                        reservation.getStatus() == ReservationStatus.BOOKED || 
                        reservation.getStatus() == ReservationStatus.CONFIRMED) {
                        logger.info("Updating reservation {} status to COMPLETED (duration expired)", reservation.getId());
                        reservation.setStatus(ReservationStatus.COMPLETED);
                        reservationRepository.save(reservation);
                    }
                }

                // Logic 3: If it's past business hours (22:00), mark as EXPIRED
                LocalTime closingTime = LocalTime.of(22, 0);
                if (now.isAfter(closingTime) && table.getStatus() == DiningTable.TableStatus.OCCUPIED) {
                    logger.info("Updating table {} to AVAILABLE (past business hours)", table.getTableNumber());
                    tableService.updateTableStatus(table.getId(), DiningTable.TableStatus.AVAILABLE);
                    
                    // Update reservation status to EXPIRED
                    if (reservation.getStatus() == ReservationStatus.ON_GOING || 
                        reservation.getStatus() == ReservationStatus.BOOKED || 
                        reservation.getStatus() == ReservationStatus.CONFIRMED) {
                        logger.info("Updating reservation {} status to EXPIRED (past business hours)", reservation.getId());
                        reservation.setStatus(ReservationStatus.EXPIRED);
                        reservationRepository.save(reservation);
                    }
                }

            } catch (Exception e) {
                logger.error("Error updating table status for reservation {}: {}", reservation.getId(), e.getMessage(), e);
            }
        }

        logger.info("Scheduled table status update completed.");
    }
}
