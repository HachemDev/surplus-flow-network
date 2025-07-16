package com.surplus360.service.mapper;

import com.surplus360.domain.UserProfile;
import com.surplus360.service.dto.UserProfileDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {CompanyMapper.class})
public interface UserProfileMapper {

    @Mapping(source = "createdAt", target = "createdDate")
    @Mapping(source = "updatedAt", target = "lastModifiedDate")
    @Mapping(source = "user.id", target = "userId")
    UserProfileDTO toDto(UserProfile userProfile);

    @Mapping(source = "createdDate", target = "createdAt")
    @Mapping(source = "lastModifiedDate", target = "updatedAt")
    @Mapping(source = "userId", target = "user", qualifiedByName = "userFromId")
    @Mapping(target = "company", ignore = true)
    UserProfile toEntity(UserProfileDTO userProfileDTO);

    List<UserProfileDTO> toDto(List<UserProfile> userProfiles);

    List<UserProfile> toEntity(List<UserProfileDTO> userProfileDTOs);

    @Named("userFromId")
    default com.surplus360.domain.User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        com.surplus360.domain.User user = new com.surplus360.domain.User();
        user.setId(id);
        return user;
    }

    @Named("userToId")
    default Long userToId(com.surplus360.domain.User user) {
        return user != null ? user.getId() : null;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "company", ignore = true)
    void partialUpdate(UserProfileDTO userProfileDTO, @MappingTarget UserProfile userProfile);
}