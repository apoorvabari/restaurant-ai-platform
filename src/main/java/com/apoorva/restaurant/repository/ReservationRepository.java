package com.apoorva.restaurant.repository;

import com.apoorva.restaurant.entity.Reservation;
import com.apoorva.restaurant.entity.Reservation.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByDeletedFalse();

    @Query("SELECT r FROM Reservation r WHERE r.tableId = :tableId AND r.reservationDate = :date AND r.deleted = false AND r.status NOT IN :excludedStatuses")
    List<Reservation> findByTableIdAndDate(@Param("tableId") Long tableId, @Param("date") LocalDate date, @Param("excludedStatuses") List<ReservationStatus> excludedStatuses);
}