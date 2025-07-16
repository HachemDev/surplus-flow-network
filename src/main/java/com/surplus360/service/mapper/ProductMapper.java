package com.surplus360.service.mapper;

import com.surplus360.domain.Product;
import com.surplus360.service.dto.ProductDTO;
import org.mapstruct.*;

import java.util.Arrays;
import java.util.List;

@Mapper(componentModel = "spring", uses = {CompanyMapper.class, TransactionMapper.class})
public interface ProductMapper {

    @Mapping(source = "createdAt", target = "createdDate")
    @Mapping(source = "updatedAt", target = "lastModifiedDate")
    @Mapping(source = "owner.id", target = "ownerId")
    @Mapping(source = "owner.firstName", target = "ownerName", qualifiedByName = "mapOwnerName")
    @Mapping(source = "company.id", target = "companyId")
    @Mapping(source = "images", target = "images", qualifiedByName = "parseImages")
    ProductDTO toDto(Product product);

    @Mapping(source = "createdDate", target = "createdAt")
    @Mapping(source = "lastModifiedDate", target = "updatedAt")
    @Mapping(source = "ownerId", target = "owner", qualifiedByName = "userFromId")
    @Mapping(source = "companyId", target = "company", qualifiedByName = "companyFromId")
    @Mapping(source = "images", target = "images", qualifiedByName = "parseImagesToString")
    @Mapping(target = "transactions", ignore = true)
    Product toEntity(ProductDTO productDTO);

    List<ProductDTO> toDto(List<Product> products);

    List<Product> toEntity(List<ProductDTO> productDTOs);

    @Named("mapOwnerName")
    default String mapOwnerName(String firstName, String lastName) {
        if (firstName == null && lastName == null) {
            return null;
        }
        return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
    }

    @Named("parseImages")
    default List<String> parseImages(String imagesJson) {
        if (imagesJson == null || imagesJson.isEmpty()) {
            return List.of();
        }
        try {
            // Simple JSON parsing - remove brackets and quotes, split by comma
            String cleanJson = imagesJson.replace("[", "").replace("]", "").replace("\"", "");
            if (cleanJson.trim().isEmpty()) {
                return List.of();
            }
            return Arrays.asList(cleanJson.split(","));
        } catch (Exception e) {
            return List.of();
        }
    }

    @Named("parseImagesToString")
    default String parseImagesToString(List<String> images) {
        if (images == null || images.isEmpty()) {
            return "[]";
        }
        return "[\"" + String.join("\", \"", images) + "\"]";
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

    @Named("companyFromId")
    default com.surplus360.domain.Company companyFromId(Long id) {
        if (id == null) {
            return null;
        }
        com.surplus360.domain.Company company = new com.surplus360.domain.Company();
        company.setId(id);
        return company;
    }

    @Named("productFromId")
    default Product productFromId(Long id) {
        if (id == null) {
            return null;
        }
        Product product = new Product();
        product.setId(id);
        return product;
    }

    @Named("productToId")
    default Long productToId(Product product) {
        return product != null ? product.getId() : null;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "transactions", ignore = true)
    void partialUpdate(ProductDTO productDTO, @MappingTarget Product product);
}