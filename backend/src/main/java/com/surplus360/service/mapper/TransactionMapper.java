package com.surplus360.service.mapper;

import com.surplus360.domain.Product;
import com.surplus360.domain.Transaction;
import com.surplus360.domain.User;
import com.surplus360.service.dto.ProductDTO;
import com.surplus360.service.dto.TransactionDTO;
import com.surplus360.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Transaction} and its DTO {@link TransactionDTO}.
 */
@Mapper(componentModel = "spring")
public interface TransactionMapper extends EntityMapper<TransactionDTO, Transaction> {
    @Mapping(target = "buyer", source = "buyer", qualifiedByName = "userLogin")
    @Mapping(target = "seller", source = "seller", qualifiedByName = "userLogin")
    @Mapping(target = "product", source = "product", qualifiedByName = "productId")
    TransactionDTO toDto(Transaction s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);

    @Named("productId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProductDTO toDtoProductId(Product product);
}
