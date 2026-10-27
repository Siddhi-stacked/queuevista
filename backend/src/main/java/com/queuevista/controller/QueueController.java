package com.queuevista.controller;

import com.queuevista.entity.*;
import com.queuevista.repository.QueueQueryRepository;
import com.queuevista.repository.ServiceRepository;
import com.queuevista.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;

/**
 * Queue endpoints. Users join and track a token; staff call the next token.
 * Position = people ahead + 1; wait = people ahead x average service time.
 */
@RestController
@RequiredArgsConstructor
@Transactional
public class QueueController {

    private static final List<QueueStatus> ACTIVE = List.of(QueueStatus.WAITING, QueueStatus.SERVING);

    private final QueueQueryRepository queue;
    private final ServiceRepository services;
    private final UserRepository users;

    public record JoinRequest(Long serviceId) {}

    private ResponseStatusException err(HttpStatus s, String m) { return new ResponseStatusException(s, m); }

    private ServiceEntity service(Long id) {
        return services.findById(id).orElseThrow(() -> err(HttpStatus.NOT_FOUND, "Service not found"));
    }

    private Map<String, Object> view(QueueEntry e) {
        LocalDate today = LocalDate.now();
        Long sid = e.getService().getId();
        long ahead = 0;
        if (e.getStatus() == QueueStatus.WAITING) {
            ahead = queue.findByService_IdAndEntryDateAndStatusOrderByDailySequenceAsc(sid, today, QueueStatus.WAITING)
                    .stream().filter(q -> q.getDailySequence() < e.getDailySequence()).count();
        }
        String serving = queue.findFirstByService_IdAndEntryDateAndStatus(sid, today, QueueStatus.SERVING)
                .map(QueueEntry::getTokenNumber).orElse("-");
        int avg = e.getService().getAverageServiceTimeMinutes();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("token", e.getTokenNumber());
        m.put("service", e.getService().getName());
        m.put("status", e.getStatus().name());
        m.put("currentlyServing", serving);
        m.put("peopleAhead", ahead);
        m.put("position", e.getStatus() == QueueStatus.WAITING ? ahead + 1 : 0);
        m.put("estimatedWaitMinutes", ahead * avg);
        return m;
    }

    @GetMapping("/api/user/services")
    public List<Map<String, Object>> listServices() {
        LocalDate today = LocalDate.now();
        List<Map<String, Object>> out = new ArrayList<>();
        for (ServiceEntity s : services.findAll()) {
            long waiting = queue.countByService_IdAndEntryDateAndStatus(s.getId(), today, QueueStatus.WAITING);
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", s.getId());
            m.put("name", s.getName());
            m.put("tokenPrefix", s.getTokenPrefix());
            m.put("operatingHours", s.getOperatingHours());
            m.put("peopleWaiting", waiting);
            m.put("estimatedWaitMinutes", waiting * s.getAverageServiceTimeMinutes());
            out.add(m);
        }
        return out;
    }

    @PostMapping("/api/user/queue/join")
    public Map<String, Object> join(@RequestBody JoinRequest req, Authentication auth) {
        User user = users.findByEmail(auth.getName()).orElseThrow(() -> err(HttpStatus.UNAUTHORIZED, "User not found"));
        LocalDate today = LocalDate.now();
        if (queue.findFirstByUser_IdAndEntryDateAndStatusIn(user.getId(), today, ACTIVE).isPresent()) {
            throw err(HttpStatus.CONFLICT, "You are already in a queue");
        }
        ServiceEntity s = service(req.serviceId());
        long waiting = queue.countByService_IdAndEntryDateAndStatus(s.getId(), today, QueueStatus.WAITING);
        if (waiting >= s.getMaxQueueSize()) throw err(HttpStatus.CONFLICT, "Queue is full");
        int seq = queue.maxSequence(s.getId(), today) + 1;
        QueueEntry e = QueueEntry.builder()
                .organization(s.getOrganization()).service(s).user(user)
                .tokenNumber(s.getTokenPrefix() + "-" + seq).dailySequence(seq)
                .entryDate(today).build();
        return view(queue.save(e));
    }

    @GetMapping("/api/user/queue/my")
    public Map<String, Object> my(Authentication auth) {
        User user = users.findByEmail(auth.getName()).orElseThrow(() -> err(HttpStatus.UNAUTHORIZED, "User not found"));
        QueueEntry e = queue.findFirstByUser_IdAndEntryDateAndStatusIn(user.getId(), LocalDate.now(), ACTIVE)
                .orElseThrow(() -> err(HttpStatus.NOT_FOUND, "You are not in any queue"));
        return view(e);
    }

    @PostMapping("/api/user/queue/leave")
    public Map<String, String> leave(Authentication auth) {
        User user = users.findByEmail(auth.getName()).orElseThrow(() -> err(HttpStatus.UNAUTHORIZED, "User not found"));
        QueueEntry e = queue.findFirstByUser_IdAndEntryDateAndStatusIn(user.getId(), LocalDate.now(), ACTIVE)
                .orElseThrow(() -> err(HttpStatus.NOT_FOUND, "You are not in any queue"));
        e.setStatus(QueueStatus.CANCELLED);
        queue.save(e);
        return Map.of("message", "You left the queue");
    }

    @GetMapping("/api/staff/queue")
    public Map<String, Object> staffQueue(@RequestParam Long serviceId) {
        LocalDate today = LocalDate.now();
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("currentlyServing", queue.findFirstByService_IdAndEntryDateAndStatus(serviceId, today, QueueStatus.SERVING)
                .map(QueueEntry::getTokenNumber).orElse("-"));
        List<String> waiting = new ArrayList<>();
        for (QueueEntry q : queue.findByService_IdAndEntryDateAndStatusOrderByDailySequenceAsc(serviceId, today, QueueStatus.WAITING)) {
            waiting.add(q.getTokenNumber());
        }
        m.put("waiting", waiting);
        return m;
    }

    @PostMapping("/api/staff/queue/next")
    public Map<String, Object> next(@RequestParam Long serviceId) {
        LocalDate today = LocalDate.now();
        queue.findFirstByService_IdAndEntryDateAndStatus(serviceId, today, QueueStatus.SERVING).ifPresent(cur -> {
            cur.setStatus(QueueStatus.COMPLETED);
            cur.setCompletedAt(Instant.now());
            queue.save(cur);
        });
        List<QueueEntry> w = queue.findByService_IdAndEntryDateAndStatusOrderByDailySequenceAsc(serviceId, today, QueueStatus.WAITING);
        if (!w.isEmpty()) {
            QueueEntry n = w.get(0);
            n.setStatus(QueueStatus.SERVING);
            n.setCalledAt(Instant.now());
            n.setServedAt(Instant.now());
            queue.save(n);
        }
        return staffQueue(serviceId);
    }

    @PostMapping("/api/staff/queue/skip")
    public Map<String, Object> skip(@RequestParam Long serviceId) {
        LocalDate today = LocalDate.now();
        queue.findFirstByService_IdAndEntryDateAndStatus(serviceId, today, QueueStatus.SERVING).ifPresent(cur -> {
            cur.setStatus(QueueStatus.SKIPPED);
            queue.save(cur);
        });
        return next(serviceId);
    }
}
