package com.surplus360.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ProductTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Product getProductSample1() {
        return new Product().id(1L).title("title1").quantity(1).unit("unit1").location("location1").tags("tags1").views(1).interests(1);
    }

    public static Product getProductSample2() {
        return new Product().id(2L).title("title2").quantity(2).unit("unit2").location("location2").tags("tags2").views(2).interests(2);
    }

    public static Product getProductRandomSampleGenerator() {
        return new Product()
            .id(longCount.incrementAndGet())
            .title(UUID.randomUUID().toString())
            .quantity(intCount.incrementAndGet())
            .unit(UUID.randomUUID().toString())
            .location(UUID.randomUUID().toString())
            .tags(UUID.randomUUID().toString())
            .views(intCount.incrementAndGet())
            .interests(intCount.incrementAndGet());
    }
}
