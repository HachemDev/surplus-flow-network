package com.surplus360.service.mapper;

import com.surplus360.domain.Transaction;
import com.surplus360.service.dto.TransactionDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductMapper.class, LogisticsMapper.class})
public interface TransactionMapper {

    @Mapping(source = "createdAt", target = "createdDate")
    @Mapping(source = "updatedAt", target = "lastModifiedDate")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "buyer.id", target = "buyerId")
    @Mapping(source = "buyer.firstName", target = "buyerName", qualifiedByName = "mapUserName")
    @Mapping(source = "seller.id", target = "sellerId")
    @Mapping(source = "seller.firstName", target = "sellerName", qualifiedByName = "mapUserName")
    TransactionDTO toDto(Transaction transaction);

    @Mapping(source = "createdDate", target = "createdAt")
    @Mapping(source = "lastModifiedDate", target = "updatedAt")
    @Mapping(source = "productId", target = "product", qualifiedByName = "productFromId")
    @Mapping(source = "buyerId", target = "buyer", qualifiedByName = "userFromId")
    @Mapping(source = "sellerId", target = "seller", qualifiedByName = "userFromId")
    @Mapping(target = "logisticsDetail", ignore = true)
    Transaction toEntity(TransactionDTO transactionDTO);

    List<TransactionDTO> toDto(List<Transaction> transactions);

    List<Transaction> toEntity(List<TransactionDTO> transactionDTOs);

    @Named("mapUserName")
    default String mapUserName(String firstName, String lastName) {
        if (firstName == null && lastName == null) {
            return null;
        }
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }

    @Named("productFromId")
    default com.surplus360.domain.Product productFromId(Long id) {
        if (id == null) {
            return null;
        }
        com.surplus360.domain.Product product = new com.surplus360.domain.Product();
        product.setId(id);
        return product;
    }

    @Named("userFromId")
    default com.surplus360.domain.User userFromId(Long id) {
        if (id == null) {
            return null;
        }
        com.surplus360.domain.User user = new com.surplus360.domain.User();
        user.setId(id);
        return user;
    }

    @Named("transactionFromId")
    default Transaction transactionFromId(Long id) {
        if (id == null) {
            return null;
        }
        Transaction transaction = new Transaction();
        transaction.setId(id);
        return transaction;
    }

    @Named("transactionToId")
    default Long transactionToId(Transaction transaction) {
        return transaction != null ? transaction.getId() : null;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "buyer", ignore = true)
    @Mapping(target = "seller", ignore = true)
    @Mapping(target = "logisticsDetail", ignore = true)
    void partialUpdate(TransactionDTO transactionDTO, @MappingTarget Transaction transaction);
}