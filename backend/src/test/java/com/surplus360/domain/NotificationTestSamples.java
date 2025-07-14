package com.surplus360.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class NotificationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Notification getNotificationSample1() {
        return new Notification().id(1L).userId("userId1").title("title1").priority("priority1");
    }

    public static Notification getNotificationSample2() {
        return new Notification().id(2L).userId("userId2").title("title2").priority("priority2");
    }

    public static Notification getNotificationRandomSampleGenerator() {
        return new Notification()
            .id(longCount.incrementAndGet())
            .userId(UUID.randomUUID().toString())
            .title(UUID.randomUUID().toString())
            .priority(UUID.randomUUID().toString());
    }
}
