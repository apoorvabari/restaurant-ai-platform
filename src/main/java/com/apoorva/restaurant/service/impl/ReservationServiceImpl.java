package com.apoorva.restaurant.service.impl;

import com.apoorva.restaurant.dto.PublicReservationResponse;
import com.apoorva.restaurant.dto.ReservationRequest;
import com.apoorva.restaurant.dto.ReservationResponse;
import com.apoorva.restaurant.entity.DiningTable;
import com.apoorva.restaurant.entity.Reservation;
import com.apoorva.restaurant.entity.Reservation.ReservationStatus;
import com.apoorva.restaurant.exception.DuplicateBookingException;
import com.apoorva.restaurant.repository.ReservationRepository;
import com.apoorva.restaurant.service.ReservationService;
import com.apoorva.restaurant.service.TableService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("all")
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final TableService tableService;

    public ReservationServiceImpl(ReservationRepository reservationRepository, TableService tableService) {
        this.reservationRepository = reservationRepository;
        this.tableService = tableService;
    }

    @Override
    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {
        // Validate date is not in the past (allow today's date)
        if (request.getReservationDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Reservation date cannot be in the past");
        }

        // Validate time is during business hours (11:00-22:00)
        LocalTime openingTime = LocalTime.of(11, 0);
        LocalTime closingTime = LocalTime.of(22, 0);
        if (request.getReservationTime().isBefore(openingTime) || 
            request.getReservationTime().isAfter(closingTime)) {
            throw new RuntimeException("Reservation time must be between 11:00 and 22:00");
        }

        // Validate guest count matches table capacity
        if (request.getTableId() != null) {
            DiningTable table = tableService.getTableById(request.getTableId());
            if (request.getNumberOfGuests() > table.getCapacity()) {
                throw new RuntimeException("Number of guests exceeds table capacity of " + table.getCapacity());
            }
        }

        // Check for duplicate booking if tableId is provided
        if (request.getTableId() != null) {
            List<Reservation> existingReservations = reservationRepository.findByTableIdAndDate(
                    request.getTableId(), 
                    request.getReservationDate(),
                    List.of(ReservationStatus.CANCELLED, ReservationStatus.EXPIRED, ReservationStatus.NO_SHOW)
            );
            
            Integer durationHours = request.getDurationHours() != null ? request.getDurationHours() : 2;
            LocalTime newStartTime = request.getReservationTime();
            LocalTime newEndTime = newStartTime.plusHours(durationHours);
            
            // Check for overlapping time ranges
            for (Reservation existing : existingReservations) {
                // Skip reservations from past dates
                if (existing.getReservationDate().isBefore(LocalDate.now())) {
                    continue;
                }

                LocalTime existingStartTime = existing.getReservationTime();
                Integer existingDuration = existing.getDurationHours() != null ? existing.getDurationHours() : 2;
                LocalTime existingEndTime = existingStartTime.plusHours(existingDuration);
                
                // Check if time ranges overlap
                if (newStartTime.isBefore(existingEndTime) && newEndTime.isAfter(existingStartTime)) {
                    throw new DuplicateBookingException("Table " + 
                            tableService.getTableById(request.getTableId()).getTableNumber() + 
                            " is already booked for " + request.getReservationDate() + 
                            " from " + existingStartTime + " to " + existingEndTime);
                }
            }
        }

        // Handle table assignment and status update BEFORE saving reservation
        DiningTable table = null;
        Integer tableNumber = null;
        if (request.getTableId() != null) {
            table = tableService.getTableById(request.getTableId());
            tableNumber = table.getTableNumber();
            // Update table status to BOOKED first
            tableService.updateTableStatus(request.getTableId(), DiningTable.TableStatus.BOOKED);
        }

        Reservation reservation = new Reservation();
        reservation.setCustomerName(request.getCustomerName());
        reservation.setPhoneNumber(request.getPhoneNumber());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setReservationDate(request.getReservationDate());
        reservation.setReservationTime(request.getReservationTime());
        reservation.setStatus(ReservationStatus.BOOKED);
        reservation.setDurationHours(request.getDurationHours() != null ? request.getDurationHours() : 2);
        reservation.setSpecialRequest(request.getSpecialRequest());

        // Set userId from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            reservation.setUserId(authentication.getName());
        }

        if (request.getTableId() != null) {
            reservation.setTableId(request.getTableId());
        }

        Reservation saved = reservationRepository.save(reservation);

        return new ReservationResponse(
                saved.getId(),
                saved.getCustomerName(),
                saved.getPhoneNumber(),
                saved.getNumberOfGuests(),
                saved.getReservationDate(),
                saved.getReservationTime(),
                saved.getStatus().name(),
                saved.getTableId(),
                tableNumber,
                saved.getDurationHours()
        );
    }

    @Override
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findByDeletedFalse().stream()
                .map(r -> {
                    Integer tableNumber = null;
                    if (r.getTableId() != null) {
                        try {
                            DiningTable table = tableService.getTableById(r.getTableId());
                            tableNumber = table.getTableNumber();
                        } catch (Exception e) {
                            // Table not found, skip table number
                        }
                    }
                    return new ReservationResponse(
                            r.getId(),
                            r.getCustomerName(),
                            r.getPhoneNumber(),
                            r.getNumberOfGuests(),
                            r.getReservationDate(),
                            r.getReservationTime(),
                            r.getStatus().toString(), // Fix: Convert ReservationStatus enum to String
                            r.getTableId(),
                            tableNumber,
                            r.getDurationHours()
                    );
                })
                .toList();
    }

    @Override
    public Page<ReservationResponse> getAllReservations(Pageable pageable) {
        List<ReservationResponse> allReservations = getAllReservations();
        
        // Apply pagination manually since we're using a list
        int start = (int) pageable.getOffset();
        
        List<ReservationResponse> paginatedList = allReservations.stream()
                .skip(start)
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());
        
        return new PageImpl<>(paginatedList, pageable, allReservations.size());
    }

    @Override
    @Transactional
    public void softDeleteReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        // Revert table status to AVAILABLE if table was assigned
        if (reservation.getTableId() != null) {
            tableService.updateTableStatus(reservation.getTableId(), DiningTable.TableStatus.AVAILABLE);
        }
        
        reservation.setDeleted(true);
        reservationRepository.save(reservation);
    }

    @Override
    public Page<ReservationResponse> getUserReservations(String userId, Pageable pageable) {
        List<ReservationResponse> allReservations = getAllReservations();
        List<ReservationResponse> userReservations = allReservations.stream()
                .filter(r -> {
                    // Check if reservation belongs to user by matching userId
                    // Since ReservationResponse doesn't have userId, we need to get it from the repository
                    Reservation reservation = reservationRepository.findById(r.getId()).orElse(null);
                    return reservation != null && userId.equals(reservation.getUserId());
                })
                .toList();
        
        int start = (int) pageable.getOffset();
        List<ReservationResponse> paginatedList = userReservations.stream()
                .skip(start)
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());
        
        return new PageImpl<>(paginatedList, pageable, userReservations.size());
    }

    @Override
    public Page<PublicReservationResponse> getPublicUserReservations(String userId, Pageable pageable) {
        List<Reservation> allReservations = reservationRepository.findByDeletedFalse();
        List<PublicReservationResponse> userReservations = allReservations.stream()
                .filter(r -> userId.equals(r.getUserId()))
                .map(r -> {
                    Integer tableNumber = null;
                    if (r.getTableId() != null) {
                        try {
                            DiningTable table = tableService.getTableById(r.getTableId());
                            tableNumber = table.getTableNumber();
                        } catch (Exception e) {
                            // Table not found, skip table number
                        }
                    }
                    return new PublicReservationResponse(
                            r.getId(),
                            r.getNumberOfGuests(),
                            r.getReservationDate(),
                            r.getReservationTime(),
                            r.getStatus().toString(),
                            r.getTableId(),
                            tableNumber,
                            r.getDurationHours()
                    );
                })
                .toList();

        int start = (int) pageable.getOffset();
        List<PublicReservationResponse> paginatedList = userReservations.stream()
                .skip(start)
                .limit(pageable.getPageSize())
                .collect(Collectors.toList());

        return new PageImpl<>(paginatedList, pageable, userReservations.size());
    }

    @Override
    @Transactional
    public void deleteUserReservation(Long reservationId, String userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Verify reservation belongs to user
        if (!userId.equals(reservation.getUserId())) {
            throw new RuntimeException("You can only delete your own reservations");
        }

        softDeleteReservation(reservationId);
    }

    @Override
    @Transactional
    public int expireOldReservations() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        
        List<Reservation> allReservations = reservationRepository.findByDeletedFalse();
        int expiredCount = 0;
        
        for (Reservation reservation : allReservations) {
            // Check if reservation date is in the past
            if (reservation.getReservationDate().isBefore(today)) {
                // Mark as expired and free up the table
                if (reservation.getStatus() != ReservationStatus.CANCELLED &&
                    reservation.getStatus() != ReservationStatus.EXPIRED &&
                    reservation.getStatus() != ReservationStatus.NO_SHOW) {
                    reservation.setStatus(ReservationStatus.EXPIRED);
                    if (reservation.getTableId() != null) {
                        tableService.updateTableStatus(reservation.getTableId(), DiningTable.TableStatus.AVAILABLE);
                    }
                    reservationRepository.save(reservation);
                    expiredCount++;
                }
            } 
            // Check if reservation is today and time has passed
            else if (reservation.getReservationDate().isEqual(today)) {
                Integer durationHours = reservation.getDurationHours() != null ? reservation.getDurationHours() : 2;
                LocalTime endTime = reservation.getReservationTime().plusHours(durationHours);
                
                if (now.isAfter(endTime) && 
                    reservation.getStatus() != ReservationStatus.CANCELLED &&
                    reservation.getStatus() != ReservationStatus.EXPIRED &&
                    reservation.getStatus() != ReservationStatus.NO_SHOW) {
                    reservation.setStatus(ReservationStatus.EXPIRED);
                    if (reservation.getTableId() != null) {
                        tableService.updateTableStatus(reservation.getTableId(), DiningTable.TableStatus.AVAILABLE);
                    }
                    reservationRepository.save(reservation);
                    expiredCount++;
                }
            }
        }
        
        return expiredCount;
    }
}