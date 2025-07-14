package com.surplus360.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CompanyTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Company getCompanySample1() {
        return new Company()
            .id(1L)
            .name("name1")
            .industry("industry1")
            .website("website1")
            .phone("phone1")
            .email("email1")
            .city("city1")
            .postalCode("postalCode1")
            .country("country1")
            .location("location1")
            .logo("logo1")
            .rseScore(1)
            .totalSurplus(1)
            .totalDonations(1)
            .totalSales(1);
    }

    public static Company getCompanySample2() {
        return new Company()
            .id(2L)
            .name("name2")
            .industry("industry2")
            .website("website2")
            .phone("phone2")
            .email("email2")
            .city("city2")
            .postalCode("postalCode2")
            .country("country2")
            .location("location2")
            .logo("logo2")
            .rseScore(2)
            .totalSurplus(2)
            .totalDonations(2)
            .totalSales(2);
    }

    public static Company getCompanyRandomSampleGenerator() {
        return new Company()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .industry(UUID.randomUUID().toString())
            .website(UUID.randomUUID().toString())
            .phone(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .postalCode(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString())
            .location(UUID.randomUUID().toString())
            .logo(UUID.randomUUID().toString())
            .rseScore(intCount.incrementAndGet())
            .totalSurplus(intCount.incrementAndGet())
            .totalDonations(intCount.incrementAndGet())
            .totalSales(intCount.incrementAndGet());
    }
}
