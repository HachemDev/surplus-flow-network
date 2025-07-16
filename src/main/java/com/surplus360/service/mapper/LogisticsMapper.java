package com.surplus360.service.mapper;

import com.surplus360.domain.Logistics;
import com.surplus360.service.dto.LogisticsDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TrackingEventMapper.class})
public interface LogisticsMapper {

    @Mapping(source = "createdAt", target = "createdDate")
    @Mapping(source = "updatedAt", target = "lastModifiedDate")
    @Mapping(source = "transaction.id", target = "transactionId")
    LogisticsDTO toDto(Logistics logistics);

    @Mapping(source = "createdDate", target = "createdAt")
    @Mapping(source = "lastModifiedDate", target = "updatedAt")
    @Mapping(source = "transactionId", target = "transaction", qualifiedByName = "transactionFromId")
    @Mapping(target = "trackingHistory", ignore = true)
    Logistics toEntity(LogisticsDTO logisticsDTO);

    List<LogisticsDTO> toDto(List<Logistics> logistics);

    List<Logistics> toEntity(List<LogisticsDTO> logisticsDTOs);

    @Named("transactionFromId")
    default com.surplus360.domain.Transaction transactionFromId(Long id) {
        if (id == null) {
            return null;
        }
        com.surplus360.domain.Transaction transaction = new com.surplus360.domain.Transaction();
        transaction.setId(id);
        return transaction;
    }

    @Named("logisticsFromId")
    default Logistics logisticsFromId(Long id) {
        if (id == null) {
            return null;
        }
        Logistics logistics = new Logistics();
        logistics.setId(id);
        return logistics;
    }

    @Named("logisticsToId")
    default Long logisticsToId(Logistics logistics) {
        return logistics != null ? logistics.getId() : null;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "transaction", ignore = true)
    @Mapping(target = "trackingHistory", ignore = true)
    void partialUpdate(LogisticsDTO logisticsDTO, @MappingTarget Logistics logistics);
}