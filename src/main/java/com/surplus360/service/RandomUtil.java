package com.surplus360.service;

import java.security.SecureRandom;

public final class RandomUtil {

    private static final int DEF_COUNT = 20;
    private static final String ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private RandomUtil() {
    }

    /**
     * Generate a password
     */
    public static String generatePassword() {
        return generateRandomAlphanumericString();
    }

    /**
     * Generate an activation key
     */
    public static String generateActivationKey() {
        return generateRandomAlphanumericString();
    }

    /**
     * Generate a reset key
     */
    public static String generateResetKey() {
        return generateRandomAlphanumericString();
    }

    /**
     * Generate a random string
     */
    public static String generateRandomAlphanumericString() {
        return generateRandomAlphanumericString(DEF_COUNT);
    }

    /**
     * Generate a random string with specified length
     */
    public static String generateRandomAlphanumericString(int count) {
        if (count <= 0) {
            throw new IllegalArgumentException("Count must be greater than 0");
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < count; i++) {
            sb.append(ALPHABET.charAt(SECURE_RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }

    /**
     * Generate a random numeric string
     */
    public static String generateRandomNumericString(int count) {
        if (count <= 0) {
            throw new IllegalArgumentException("Count must be greater than 0");
        }

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < count; i++) {
            sb.append(SECURE_RANDOM.nextInt(10));
        }
        return sb.toString();
    }

    /**
     * Generate a random UUID-like string
     */
    public static String generateUUID() {
        return java.util.UUID.randomUUID().toString();
    }
}