package com.surplus360.web.rest.util;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.web.util.UriComponentsBuilder;

import java.text.MessageFormat;

public final class PaginationUtil {

    private static final String HEADER_X_TOTAL_COUNT = "X-Total-Count";
    private static final String HEADER_LINK_FORMAT = "<{0}>; rel=\"{1}\"";

    private PaginationUtil() {
    }

    /**
     * Generate pagination headers for a Spring Data Page object.
     */
    public static <T> HttpHeaders generatePaginationHttpHeaders(Page<T> page, String baseUrl) {
        HttpHeaders headers = new HttpHeaders();
        headers.add(HEADER_X_TOTAL_COUNT, Long.toString(page.getTotalElements()));
        
        String link = "";
        if (page.getNumber() + 1 < page.getTotalPages()) {
            link = addLinkHeader(link, buildUri(baseUrl, page.getNumber() + 1, page.getSize()), "next");
        }
        if (page.getNumber() > 0) {
            link = addLinkHeader(link, buildUri(baseUrl, page.getNumber() - 1, page.getSize()), "prev");
        }
        link = addLinkHeader(link, buildUri(baseUrl, page.getTotalPages() - 1, page.getSize()), "last");
        link = addLinkHeader(link, buildUri(baseUrl, 0, page.getSize()), "first");
        
        if (!link.isEmpty()) {
            headers.add(HttpHeaders.LINK, link);
        }
        
        return headers;
    }

    private static String addLinkHeader(String link, String uri, String rel) {
        if (!link.isEmpty()) {
            link += ", ";
        }
        return link + MessageFormat.format(HEADER_LINK_FORMAT, uri, rel);
    }

    private static String buildUri(String baseUrl, int page, int size) {
        return UriComponentsBuilder.fromUriString(baseUrl)
            .queryParam("page", page)
            .queryParam("size", size)
            .build()
            .toUriString();
    }
}