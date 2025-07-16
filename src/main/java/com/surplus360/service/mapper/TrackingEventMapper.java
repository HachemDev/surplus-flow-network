package com.surplus360.service.mapper;

import com.surplus360.domain.TrackingEvent;
import com.surplus360.service.dto.TrackingEventDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TrackingEventMapper {

    @Mapping(source = "createdAt", target = "createdDate")
    @Mapping(source = "updatedAt", target = "lastModifiedDate")
    @Mapping(source = "logistics.id", target = "logisticsId")
    TrackingEventDTO toDto(TrackingEvent trackingEvent);

    @Mapping(source = "createdDate", target = "createdAt")
    @Mapping(source = "lastModifiedDate", target = "updatedAt")
    @Mapping(source = "logisticsId", target = "logistics", qualifiedByName = "logisticsFromId")
    TrackingEvent toEntity(TrackingEventDTO trackingEventDTO);

    List<TrackingEventDTO> toDto(List<TrackingEvent> trackingEvents);

    List<TrackingEvent> toEntity(List<TrackingEventDTO> trackingEventDTOs);

    @Named("logisticsFromId")
    default com.surplus360.domain.Logistics logisticsFromId(Long id) {
        if (id == null) {
            return null;
        }
        com.surplus360.domain.Logistics logistics = new com.surplus360.domain.Logistics();
        logistics.setId(id);
        return logistics;
    }

    @Named("trackingEventFromId")
    default TrackingEvent trackingEventFromId(Long id) {
        if (id == null) {
            return null;
        }
        TrackingEvent trackingEvent = new TrackingEvent();
        trackingEvent.setId(id);
        return trackingEvent;
    }

    @Named("trackingEventToId")
    default Long trackingEventToId(TrackingEvent trackingEvent) {
        return trackingEvent != null ? trackingEvent.getId() : null;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "logistics", ignore = true)
    void partialUpdate(TrackingEventDTO trackingEventDTO, @MappingTarget TrackingEvent trackingEvent);
}