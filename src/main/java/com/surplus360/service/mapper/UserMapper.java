package com.surplus360.service.mapper;

import com.surplus360.domain.Authority;
import com.surplus360.domain.User;
import com.surplus360.service.dto.UserDTO;
import org.mapstruct.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = {UserProfileMapper.class})
public interface UserMapper {

    @Mapping(source = "authorities", target = "authorities", qualifiedByName = "authoritiesToStrings")
    @Mapping(source = "createdAt", target = "createdDate")
    @Mapping(source = "updatedAt", target = "lastModifiedDate")
    UserDTO toDto(User user);

    @Mapping(source = "authorities", target = "authorities", qualifiedByName = "stringsToAuthorities")
    @Mapping(source = "createdDate", target = "createdAt")
    @Mapping(source = "lastModifiedDate", target = "updatedAt")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "activationKey", ignore = true)
    @Mapping(target = "resetKey", ignore = true)
    @Mapping(target = "resetDate", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    User toEntity(UserDTO userDTO);

    List<UserDTO> toDto(List<User> users);

    List<User> toEntity(List<UserDTO> userDTOs);

    @Named("authoritiesToStrings")
    default Set<String> authoritiesToStrings(Set<Authority> authorities) {
        return authorities.stream()
            .map(Authority::getName)
            .collect(Collectors.toSet());
    }

    @Named("stringsToAuthorities")
    default Set<Authority> stringsToAuthorities(Set<String> authorities) {
        return authorities.stream()
            .map(authorityName -> {
                Authority authority = new Authority();
                authority.setName(authorityName);
                return authority;
            })
            .collect(Collectors.toSet());
    }

    @Named("userFromId")
    default User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        User user = new User();
        user.setId(id);
        return user;
    }

    @Named("userToId")
    default Long userToId(User user) {
        return user != null ? user.getId() : null;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "activationKey", ignore = true)
    @Mapping(target = "resetKey", ignore = true)
    @Mapping(target = "resetDate", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    @Mapping(target = "notifications", ignore = true)
    @Mapping(target = "profile", ignore = true)
    void partialUpdate(UserDTO userDTO, @MappingTarget User user);
}