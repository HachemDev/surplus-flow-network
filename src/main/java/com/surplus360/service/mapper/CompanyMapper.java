package com.surplus360.service.mapper;

import com.surplus360.domain.Company;
import com.surplus360.service.dto.CompanyDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserProfileMapper.class})
public interface CompanyMapper {

    @Mapping(source = "createdAt", target = "createdDate")
    @Mapping(source = "updatedAt", target = "lastModifiedDate")
    @Mapping(target = "stats", expression = "java(mapStats(company))")
    CompanyDTO toDto(Company company);

    @Mapping(source = "createdDate", target = "createdAt")
    @Mapping(source = "lastModifiedDate", target = "updatedAt")
    @Mapping(source = "stats.totalSurplus", target = "totalSurplus")
    @Mapping(source = "stats.totalDonations", target = "totalDonations")
    @Mapping(source = "stats.totalSales", target = "totalSales")
    @Mapping(source = "stats.co2Saved", target = "co2Saved")
    @Mapping(source = "stats.wasteReduced", target = "wasteReduced")
    @Mapping(target = "users", ignore = true)
    @Mapping(target = "products", ignore = true)
    Company toEntity(CompanyDTO companyDTO);

    List<CompanyDTO> toDto(List<Company> companies);

    List<Company> toEntity(List<CompanyDTO> companyDTOs);

    default CompanyDTO.CompanyStatsDTO mapStats(Company company) {
        return new CompanyDTO.CompanyStatsDTO(
            company.getTotalSurplus(),
            company.getTotalDonations(),
            company.getTotalSales(),
            company.getCo2Saved(),
            company.getWasteReduced()
        );
    }

    @Named("companyFromId")
    default Company companyFromId(Long id) {
        if (id == null) {
            return null;
        }
        Company company = new Company();
        company.setId(id);
        return company;
    }

    @Named("companyToId")
    default Long companyToId(Company company) {
        return company != null ? company.getId() : null;
    }

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "users", ignore = true)
    @Mapping(target = "products", ignore = true)
    void partialUpdate(CompanyDTO companyDTO, @MappingTarget Company company);
}