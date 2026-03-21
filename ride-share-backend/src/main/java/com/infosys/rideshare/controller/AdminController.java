package com.infosys.rideshare.controller;

import com.infosys.rideshare.entity.AbstractUser;
import com.infosys.rideshare.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<AbstractUser>> getAllUsers(@RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            return ResponseEntity.ok(adminService.getUsersByStatus(status));
        }
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/verify")
    public ResponseEntity<?> verifyUser(@PathVariable Long id, @RequestParam String status, @RequestParam String role) {
        System.out.println("Verifying user: ID=" + id + ", Status=" + status + ", Role=" + role);
        boolean updated = adminService.verifyUser(id, status, role);
        if (updated) {
            return ResponseEntity.ok("User status updated to " + status);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }
}
