package com.infosys.rideshare.service;

import com.infosys.rideshare.entity.AbstractUser;
import com.infosys.rideshare.repository.AdminRepository;
import com.infosys.rideshare.repository.DriverRepository;
import com.infosys.rideshare.repository.PassengerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private DriverRepository driverRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AbstractUser user = null;

        if (adminRepository.existsByEmail(email)) {
            user = adminRepository.findByEmail(email).get();
        } else if (passengerRepository.existsByEmail(email)) {
            user = passengerRepository.findByEmail(email).get();
        } else if (driverRepository.existsByEmail(email)) {
            user = driverRepository.findByEmail(email).get();
        }

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }

        // Map our User POJO to Spring Security UserDetails
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(),
                java.util.Collections
                        .singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + user.getRole())));
    }
}
