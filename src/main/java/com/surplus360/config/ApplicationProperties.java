package com.surplus360.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@Data
public class ApplicationProperties {

    private Jwt jwt = new Jwt();
    private Cors cors = new Cors();
    private FileUpload fileUpload = new FileUpload();
    private Notification notification = new Notification();
    private Elasticsearch elasticsearch = new Elasticsearch();
    private Rse rse = new Rse();
    private Analytics analytics = new Analytics();
    private Security security = new Security();

    @Data
    public static class Jwt {
        private String secret;
        private long expiration;
        private long refreshExpiration;
    }

    @Data
    public static class Cors {
        private String allowedOrigins;
        private String allowedMethods;
        private String allowedHeaders;
        private boolean allowCredentials;
    }

    @Data
    public static class FileUpload {
        private String basePath;
        private String maxSize;
        private String allowedTypes;
    }

    @Data
    public static class Notification {
        private Email email = new Email();
        private Websocket websocket = new Websocket();

        @Data
        public static class Email {
            private boolean enabled;
            private String from;
        }

        @Data
        public static class Websocket {
            private boolean enabled;
        }
    }

    @Data
    public static class Elasticsearch {
        private String indexPrefix;
        private String refreshInterval;
    }

    @Data
    public static class Rse {
        private Calculation calculation = new Calculation();

        @Data
        public static class Calculation {
            private double co2Factor;
            private double wasteFactor;
        }
    }

    @Data
    public static class Analytics {
        private boolean enabled;
        private int retentionDays;
    }

    @Data
    public static class Security {
        private RateLimit rateLimit = new RateLimit();
        private String contentSecurityPolicy;

        @Data
        public static class RateLimit {
            private boolean enabled;
            private int requestsPerMinute;
        }
    }
}