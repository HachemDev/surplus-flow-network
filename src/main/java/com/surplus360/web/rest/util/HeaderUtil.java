package com.surplus360.web.rest.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;

@Slf4j
public final class HeaderUtil {

    private static final String APPLICATION_NAME = "surplus360";

    private HeaderUtil() {
    }

    /**
     * Create an alert header for entity creation.
     */
    public static HttpHeaders createEntityCreationAlert(String entityName, String param) {
        String message = APPLICATION_NAME + "." + entityName + ".created";
        return createAlert(message, param);
    }

    /**
     * Create an alert header for entity update.
     */
    public static HttpHeaders createEntityUpdateAlert(String entityName, String param) {
        String message = APPLICATION_NAME + "." + entityName + ".updated";
        return createAlert(message, param);
    }

    /**
     * Create an alert header for entity deletion.
     */
    public static HttpHeaders createEntityDeletionAlert(String entityName, String param) {
        String message = APPLICATION_NAME + "." + entityName + ".deleted";
        return createAlert(message, param);
    }

    /**
     * Create an alert header for failures.
     */
    public static HttpHeaders createFailureAlert(String entityName, String errorKey, String defaultMessage) {
        log.error("Entity processing failed, {}", defaultMessage);
        
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-" + APPLICATION_NAME + "-error", defaultMessage);
        headers.add("X-" + APPLICATION_NAME + "-params", entityName);
        return headers;
    }

    /**
     * Create a generic alert header.
     */
    public static HttpHeaders createAlert(String message, String param) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-" + APPLICATION_NAME + "-alert", message);
        headers.add("X-" + APPLICATION_NAME + "-params", param);
        return headers;
    }
}