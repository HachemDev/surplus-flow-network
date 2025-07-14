package com.surplus360.service.mapper;

import com.surplus360.domain.Company;
import com.surplus360.domain.Product;
import com.surplus360.domain.User;
import com.surplus360.service.dto.CompanyDTO;
import com.surplus360.service.dto.ProductDTO;
import com.surplus360.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Product} and its DTO {@link ProductDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductMapper extends EntityMapper<ProductDTO, Product> {
    @Mapping(target = "owner", source = "owner", qualifiedByName = "userLogin")
    @Mapping(target = "company", source = "company", qualifiedByName = "companyId")
    ProductDTO toDto(Product s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);

    @Named("companyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CompanyDTO toDtoCompanyId(Company company);
}
