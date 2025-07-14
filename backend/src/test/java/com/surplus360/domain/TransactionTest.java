package com.surplus360.domain;

import static com.surplus360.domain.ProductTestSamples.*;
import static com.surplus360.domain.TransactionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.surplus360.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TransactionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Transaction.class);
        Transaction transaction1 = getTransactionSample1();
        Transaction transaction2 = new Transaction();
        assertThat(transaction1).isNotEqualTo(transaction2);

        transaction2.setId(transaction1.getId());
        assertThat(transaction1).isEqualTo(transaction2);

        transaction2 = getTransactionSample2();
        assertThat(transaction1).isNotEqualTo(transaction2);
    }

    @Test
    void productTest() {
        Transaction transaction = getTransactionRandomSampleGenerator();
        Product productBack = getProductRandomSampleGenerator();

        transaction.setProduct(productBack);
        assertThat(transaction.getProduct()).isEqualTo(productBack);

        transaction.product(null);
        assertThat(transaction.getProduct()).isNull();
    }
}
