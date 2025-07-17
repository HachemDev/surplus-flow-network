package com.surplus.controller;

import com.surplus.domain.Company;
import com.surplus.domain.User;
import com.surplus.domain.UserProfile;
import com.surplus.repository.CompanyRepository;
import com.surplus.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CompanyController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @GetMapping("/my-company")
    @PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
    public ResponseEntity<?> getMyCompany() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        Optional<Company> company = companyRepository.findByUserId(user.getId());
        if (company.isPresent()) {
            return ResponseEntity.ok(company.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<?> getAllCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sort,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(required = false) String search) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<Company> companies;
        if (search != null && !search.isEmpty()) {
            companies = companyRepository.findByNameContainingIgnoreCase(search, pageable);
        } else {
            companies = companyRepository.findAll(pageable);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", companies.getContent());
        response.put("totalElements", companies.getTotalElements());
        response.put("totalPages", companies.getTotalPages());
        response.put("size", companies.getSize());
        response.put("number", companies.getNumber());
        response.put("first", companies.isFirst());
        response.put("last", companies.isLast());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompany(@PathVariable Long id) {
        Optional<Company> company = companyRepository.findById(id);
        if (company.isPresent()) {
            return ResponseEntity.ok(company.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
    public ResponseEntity<?> createCompany(@RequestBody Company company) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        // Check if user already has a company
        Optional<Company> existingCompany = companyRepository.findByUserId(user.getId());
        if (existingCompany.isPresent()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "User already has a company"));
        }
        
        Company savedCompany = companyRepository.save(company);
        
        // Update user profile to link to company
        Optional<UserProfile> userProfile = userProfileRepository.findByUserId(user.getId());
        if (userProfile.isPresent()) {
            UserProfile profile = userProfile.get();
            profile.setCompany(savedCompany);
            userProfileRepository.save(profile);
        }
        
        return ResponseEntity.ok(savedCompany);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('COMPANY') or hasRole('ADMIN')")
    public ResponseEntity<?> updateCompany(@PathVariable Long id, @RequestBody Company company) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        
        Optional<Company> existingCompany = companyRepository.findById(id);
        if (existingCompany.isPresent()) {
            // Check if user owns this company or is admin
            Optional<Company> userCompany = companyRepository.findByUserId(user.getId());
            if (userCompany.isPresent() && userCompany.get().getId().equals(id) || 
                user.getAuthorities().stream().anyMatch(auth2 -> auth2.getAuthority().equals("ROLE_ADMIN"))) {
                
                company.setId(id);
                Company savedCompany = companyRepository.save(company);
                return ResponseEntity.ok(savedCompany);
            }
            return ResponseEntity.status(403).body(Map.of("error", "Access denied"));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCompany(@PathVariable Long id) {
        if (companyRepository.existsById(id)) {
            companyRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<?> getCompanyStats(@PathVariable Long id) {
        Optional<Company> company = companyRepository.findById(id);
        if (company.isPresent()) {
            Company c = company.get();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalSurplus", c.getTotalSurplus());
            stats.put("totalDonations", c.getTotalDonations());
            stats.put("totalSales", c.getTotalSales());
            stats.put("co2Saved", c.getCo2Saved());
            stats.put("wasteReduced", c.getWasteReduced());
            
            // Monthly data (placeholder - you can implement actual monthly calculations)
            Map<String, Object>[] monthlyData = new Map[12];
            for (int i = 0; i < 12; i++) {
                Map<String, Object> monthData = new HashMap<>();
                monthData.put("month", getMonthName(i + 1));
                monthData.put("surplus", (int)(Math.random() * 100));
                monthData.put("donations", (int)(Math.random() * 50));
                monthData.put("sales", (int)(Math.random() * 30));
                monthlyData[i] = monthData;
            }
            stats.put("monthlyData", monthlyData);
            
            return ResponseEntity.ok(stats);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/verified")
    public ResponseEntity<?> getVerifiedCompanies() {
        List<Company> companies = companyRepository.findByVerified(true);
        return ResponseEntity.ok(companies);
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> verifyCompany(@PathVariable Long id) {
        Optional<Company> company = companyRepository.findById(id);
        if (company.isPresent()) {
            Company c = company.get();
            c.setVerified(true);
            Company savedCompany = companyRepository.save(c);
            return ResponseEntity.ok(savedCompany);
        }
        return ResponseEntity.notFound().build();
    }

    private String getMonthName(int month) {
        String[] months = {"January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"};
        return months[month - 1];
    }
}