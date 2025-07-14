package com.surplus360.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class UserProfileTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static UserProfile getUserProfileSample1() {
        return new UserProfile()
            .id(1L)
            .firstName("firstName1")
            .lastName("lastName1")
            .phone("phone1")
            .city("city1")
            .postalCode("postalCode1")
            .country("country1")
            .avatar("avatar1")
            .email("email1")
            .companyId("companyId1");
    }

    public static UserProfile getUserProfileSample2() {
        return new UserProfile()
            .id(2L)
            .firstName("firstName2")
            .lastName("lastName2")
            .phone("phone2")
            .city("city2")
            .postalCode("postalCode2")
            .country("country2")
            .avatar("avatar2")
            .email("email2")
            .companyId("companyId2");
    }

    public static UserProfile getUserProfileRandomSampleGenerator() {
        return new UserProfile()
            .id(longCount.incrementAndGet())
            .firstName(UUID.randomUUID().toString())
            .lastName(UUID.randomUUID().toString())
            .phone(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .postalCode(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString())
            .avatar(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .companyId(UUID.randomUUID().toString());
    }
}
