package com.surplus360.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class TransactionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Transaction getTransactionSample1() {
        return new Transaction().id(1L).quantity(1);
    }

    public static Transaction getTransactionSample2() {
        return new Transaction().id(2L).quantity(2);
    }

    public static Transaction getTransactionRandomSampleGenerator() {
        return new Transaction().id(longCount.incrementAndGet()).quantity(intCount.incrementAndGet());
    }
}
