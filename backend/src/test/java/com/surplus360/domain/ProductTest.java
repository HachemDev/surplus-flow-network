package com.surplus360.domain;

import static com.surplus360.domain.CompanyTestSamples.*;
import static com.surplus360.domain.ProductTestSamples.*;
import static com.surplus360.domain.TransactionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.surplus360.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ProductTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Product.class);
        Product product1 = getProductSample1();
        Product product2 = new Product();
        assertThat(product1).isNotEqualTo(product2);

        product2.setId(product1.getId());
        assertThat(product1).isEqualTo(product2);

        product2 = getProductSample2();
        assertThat(product1).isNotEqualTo(product2);
    }

    @Test
    void transactionsTest() {
        Product product = getProductRandomSampleGenerator();
        Transaction transactionBack = getTransactionRandomSampleGenerator();

        product.addTransactions(transactionBack);
        assertThat(product.getTransactions()).containsOnly(transactionBack);
        assertThat(transactionBack.getProduct()).isEqualTo(product);

        product.removeTransactions(transactionBack);
        assertThat(product.getTransactions()).doesNotContain(transactionBack);
        assertThat(transactionBack.getProduct()).isNull();

        product.transactions(new HashSet<>(Set.of(transactionBack)));
        assertThat(product.getTransactions()).containsOnly(transactionBack);
        assertThat(transactionBack.getProduct()).isEqualTo(product);

        product.setTransactions(new HashSet<>());
        assertThat(product.getTransactions()).doesNotContain(transactionBack);
        assertThat(transactionBack.getProduct()).isNull();
    }

    @Test
    void companyTest() {
        Product product = getProductRandomSampleGenerator();
        Company companyBack = getCompanyRandomSampleGenerator();

        product.setCompany(companyBack);
        assertThat(product.getCompany()).isEqualTo(companyBack);

        product.company(null);
        assertThat(product.getCompany()).isNull();
    }
}
