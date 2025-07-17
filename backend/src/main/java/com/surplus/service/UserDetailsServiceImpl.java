package com.surplus.service;

import com.surplus.domain.User;
import com.surplus.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        log.debug("Authenticating user '{}'", login);

        if (login.contains("@")) {
            return userRepository.findOneWithAuthoritiesByEmail(login)
                .map(this::createUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("User with email " + login + " was not found in the database"));
        }

        return userRepository.findOneWithAuthoritiesByLogin(login.toLowerCase())
            .map(this::createUserDetails)
            .orElseThrow(() -> new UsernameNotFoundException("User " + login + " was not found in the database"));
    }

    private UserDetails createUserDetails(User user) {
        if (!user.isActivated()) {
            throw new RuntimeException("User " + user.getLogin() + " was not activated");
        }
        return user;
    }
}