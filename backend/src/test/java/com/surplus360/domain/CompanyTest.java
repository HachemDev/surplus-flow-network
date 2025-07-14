package com.surplus360.domain;

import static com.surplus360.domain.CompanyTestSamples.*;
import static com.surplus360.domain.ProductTestSamples.*;
import static com.surplus360.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.surplus360.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CompanyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Company.class);
        Company company1 = getCompanySample1();
        Company company2 = new Company();
        assertThat(company1).isNotEqualTo(company2);

        company2.setId(company1.getId());
        assertThat(company1).isEqualTo(company2);

        company2 = getCompanySample2();
        assertThat(company1).isNotEqualTo(company2);
    }

    @Test
    void usersTest() {
        Company company = getCompanyRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        company.addUsers(userProfileBack);
        assertThat(company.getUsers()).containsOnly(userProfileBack);
        assertThat(userProfileBack.getCompany()).isEqualTo(company);

        company.removeUsers(userProfileBack);
        assertThat(company.getUsers()).doesNotContain(userProfileBack);
        assertThat(userProfileBack.getCompany()).isNull();

        company.users(new HashSet<>(Set.of(userProfileBack)));
        assertThat(company.getUsers()).containsOnly(userProfileBack);
        assertThat(userProfileBack.getCompany()).isEqualTo(company);

        company.setUsers(new HashSet<>());
        assertThat(company.getUsers()).doesNotContain(userProfileBack);
        assertThat(userProfileBack.getCompany()).isNull();
    }

    @Test
    void productsTest() {
        Company company = getCompanyRandomSampleGenerator();
        Product productBack = getProductRandomSampleGenerator();

        company.addProducts(productBack);
        assertThat(company.getProducts()).containsOnly(productBack);
        assertThat(productBack.getCompany()).isEqualTo(company);

        company.removeProducts(productBack);
        assertThat(company.getProducts()).doesNotContain(productBack);
        assertThat(productBack.getCompany()).isNull();

        company.products(new HashSet<>(Set.of(productBack)));
        assertThat(company.getProducts()).containsOnly(productBack);
        assertThat(productBack.getCompany()).isEqualTo(company);

        company.setProducts(new HashSet<>());
        assertThat(company.getProducts()).doesNotContain(productBack);
        assertThat(productBack.getCompany()).isNull();
    }
}
