package com.surplus360.service.mapper;

import com.surplus360.domain.Notification;
import com.surplus360.service.dto.NotificationDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(source = "createdAt", target = "createdDate")
    @Mapping(source = "updatedAt", target = "lastModifiedDate")
    NotificationDTO toDto(Notification notification);

    @Mapping(source = "createdDate", target = "createdAt")
    @Mapping(source = "lastModifiedDate", target = "updatedAt")
    @Mapping(target = "user", ignore = true)
    Notification toEntity(NotificationDTO notificationDTO);

    List<NotificationDTO> toDto(List<Notification> notifications);

    List<Notification> toEntity(List<NotificationDTO> notificationDTOs);

    @Named("notificationFromId")
    default Notification notificationFromId(Long id) {
        if (id == null) {
            return null;
        }
        Notification notification = new Notification();
        notification.setId(id);
        return notification;
    }

    @Named("notificationToId")
    default Long notificationToId(Notification notification) {
        return notification != null ? notification.getId() : null;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    void partialUpdate(NotificationDTO notificationDTO, @MappingTarget Notification notification);
}