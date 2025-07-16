package com.surplus360.service;

import com.surplus360.config.ApplicationProperties;
import com.surplus360.domain.User;
import com.surplus360.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final ApplicationProperties applicationProperties;
    private final UserRepository userRepository;
    private final SpringTemplateEngine templateEngine;

    /**
     * Send a simple email
     */
    @Async
    public void sendEmail(String to, String subject, String content) {
        log.debug("Sending email to '{}' with subject '{}'", to, subject);
        
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(applicationProperties.getNotification().getEmail().getFrom());
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            
            javaMailSender.send(message);
            log.debug("Email sent successfully to: {}", to);
            
        } catch (MailException e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Send HTML email
     */
    @Async
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        log.debug("Sending HTML email to '{}' with subject '{}'", to, subject);
        
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(applicationProperties.getNotification().getEmail().getFrom());
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            javaMailSender.send(mimeMessage);
            log.debug("HTML email sent successfully to: {}", to);
            
        } catch (MessagingException | MailException e) {
            log.error("Failed to send HTML email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Send email from template
     */
    @Async
    public void sendEmailFromTemplate(String to, String subject, String templateName, Context context) {
        log.debug("Sending template email to '{}' with template '{}'", to, templateName);
        
        try {
            String htmlContent = templateEngine.process(templateName, context);
            sendHtmlEmail(to, subject, htmlContent);
            
        } catch (Exception e) {
            log.error("Failed to send template email to {}: {}", to, e.getMessage());
        }
    }

    /**
     * Send activation email
     */
    @Async
    public void sendActivationEmail(User user) {
        log.debug("Sending activation email to user: {}", user.getEmail());
        
        if (!applicationProperties.getNotification().getEmail().isEnabled()) {
            log.debug("Email notifications are disabled");
            return;
        }
        
        Context context = new Context(Locale.getDefault());
        context.setVariable("user", user);
        context.setVariable("activationKey", user.getActivationKey());
        context.setVariable("baseUrl", getBaseUrl());
        
        String subject = "Surplus360 - Account Activation";
        sendEmailFromTemplate(user.getEmail(), subject, "activation-email", context);
    }

    /**
     * Send password reset email
     */
    @Async
    public void sendPasswordResetEmail(User user) {
        log.debug("Sending password reset email to user: {}", user.getEmail());
        
        if (!applicationProperties.getNotification().getEmail().isEnabled()) {
            log.debug("Email notifications are disabled");
            return;
        }
        
        Context context = new Context(Locale.getDefault());
        context.setVariable("user", user);
        context.setVariable("resetKey", user.getResetKey());
        context.setVariable("baseUrl", getBaseUrl());
        
        String subject = "Surplus360 - Password Reset";
        sendEmailFromTemplate(user.getEmail(), subject, "password-reset-email", context);
    }

    /**
     * Send welcome email
     */
    @Async
    public void sendWelcomeEmail(User user) {
        log.debug("Sending welcome email to user: {}", user.getEmail());
        
        if (!applicationProperties.getNotification().getEmail().isEnabled()) {
            log.debug("Email notifications are disabled");
            return;
        }
        
        Context context = new Context(Locale.getDefault());
        context.setVariable("user", user);
        context.setVariable("baseUrl", getBaseUrl());
        
        String subject = "Welcome to Surplus360!";
        sendEmailFromTemplate(user.getEmail(), subject, "welcome-email", context);
    }

    /**
     * Send notification email
     */
    @Async
    public void sendNotificationEmail(String userId, String title, String message) {
        log.debug("Sending notification email to user: {}", userId);
        
        if (!applicationProperties.getNotification().getEmail().isEnabled()) {
            log.debug("Email notifications are disabled");
            return;
        }
        
        Optional<User> userOpt = userRepository.findById(Long.parseLong(userId));
        if (userOpt.isEmpty()) {
            log.error("User not found for notification email: {}", userId);
            return;
        }
        
        User user = userOpt.get();
        Context context = new Context(Locale.getDefault());
        context.setVariable("user", user);
        context.setVariable("title", title);
        context.setVariable("message", message);
        context.setVariable("baseUrl", getBaseUrl());
        
        String subject = "Surplus360 - " + title;
        sendEmailFromTemplate(user.getEmail(), subject, "notification-email", context);
    }

    /**
     * Send transaction update email
     */
    @Async
    public void sendTransactionUpdateEmail(String userId, String transactionId, String status, String message) {
        log.debug("Sending transaction update email to user: {}", userId);
        
        if (!applicationProperties.getNotification().getEmail().isEnabled()) {
            log.debug("Email notifications are disabled");
            return;
        }
        
        Optional<User> userOpt = userRepository.findById(Long.parseLong(userId));
        if (userOpt.isEmpty()) {
            log.error("User not found for transaction update email: {}", userId);
            return;
        }
        
        User user = userOpt.get();
        Context context = new Context(Locale.getDefault());
        context.setVariable("user", user);
        context.setVariable("transactionId", transactionId);
        context.setVariable("status", status);
        context.setVariable("message", message);
        context.setVariable("baseUrl", getBaseUrl());
        
        String subject = "Surplus360 - Transaction Update";
        sendEmailFromTemplate(user.getEmail(), subject, "transaction-update-email", context);
    }

    /**
     * Send product match email
     */
    @Async
    public void sendProductMatchEmail(String userId, String productTitle, String productId) {
        log.debug("Sending product match email to user: {}", userId);
        
        if (!applicationProperties.getNotification().getEmail().isEnabled()) {
            log.debug("Email notifications are disabled");
            return;
        }
        
        Optional<User> userOpt = userRepository.findById(Long.parseLong(userId));
        if (userOpt.isEmpty()) {
            log.error("User not found for product match email: {}", userId);
            return;
        }
        
        User user = userOpt.get();
        Context context = new Context(Locale.getDefault());
        context.setVariable("user", user);
        context.setVariable("productTitle", productTitle);
        context.setVariable("productId", productId);
        context.setVariable("baseUrl", getBaseUrl());
        
        String subject = "Surplus360 - New Product Match";
        sendEmailFromTemplate(user.getEmail(), subject, "product-match-email", context);
    }

    /**
     * Send bulk email to multiple recipients
     */
    @Async
    public void sendBulkEmail(String[] recipients, String subject, String content) {
        log.debug("Sending bulk email to {} recipients", recipients.length);
        
        if (!applicationProperties.getNotification().getEmail().isEnabled()) {
            log.debug("Email notifications are disabled");
            return;
        }
        
        for (String recipient : recipients) {
            try {
                sendEmail(recipient, subject, content);
                // Add small delay to avoid overwhelming the mail server
                Thread.sleep(100);
            } catch (Exception e) {
                log.error("Failed to send bulk email to {}: {}", recipient, e.getMessage());
            }
        }
    }

    /**
     * Send newsletter email
     */
    @Async
    public void sendNewsletterEmail(String[] recipients, String subject, String templateName, Context context) {
        log.debug("Sending newsletter to {} recipients", recipients.length);
        
        if (!applicationProperties.getNotification().getEmail().isEnabled()) {
            log.debug("Email notifications are disabled");
            return;
        }
        
        try {
            String htmlContent = templateEngine.process(templateName, context);
            
            for (String recipient : recipients) {
                try {
                    sendHtmlEmail(recipient, subject, htmlContent);
                    // Add small delay to avoid overwhelming the mail server
                    Thread.sleep(100);
                } catch (Exception e) {
                    log.error("Failed to send newsletter to {}: {}", recipient, e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Failed to process newsletter template: {}", e.getMessage());
        }
    }

    /**
     * Send system maintenance notification
     */
    @Async
    public void sendMaintenanceNotification(String[] recipients, String maintenanceDate, String duration) {
        log.debug("Sending maintenance notification to {} recipients", recipients.length);
        
        if (!applicationProperties.getNotification().getEmail().isEnabled()) {
            log.debug("Email notifications are disabled");
            return;
        }
        
        Context context = new Context(Locale.getDefault());
        context.setVariable("maintenanceDate", maintenanceDate);
        context.setVariable("duration", duration);
        context.setVariable("baseUrl", getBaseUrl());
        
        String subject = "Surplus360 - Scheduled Maintenance Notice";
        
        try {
            String htmlContent = templateEngine.process("maintenance-notification-email", context);
            
            for (String recipient : recipients) {
                try {
                    sendHtmlEmail(recipient, subject, htmlContent);
                    Thread.sleep(100);
                } catch (Exception e) {
                    log.error("Failed to send maintenance notification to {}: {}", recipient, e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Failed to process maintenance notification template: {}", e.getMessage());
        }
    }

    /**
     * Check if email service is available
     */
    public boolean isEmailServiceAvailable() {
        try {
            javaMailSender.createMimeMessage();
            return true;
        } catch (Exception e) {
            log.error("Email service is not available: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get base URL for email links
     */
    private String getBaseUrl() {
        // In a real application, this would come from configuration
        return "http://localhost:3000";
    }
}