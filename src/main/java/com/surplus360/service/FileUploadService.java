package com.surplus360.service;

import com.surplus360.config.ApplicationProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    private final ApplicationProperties applicationProperties;

    // Allowed image types
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
        "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    // Allowed document types
    private static final List<String> ALLOWED_DOCUMENT_TYPES = Arrays.asList(
        "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    // Maximum file size (5MB)
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    /**
     * Upload a single file
     */
    public String uploadFile(MultipartFile file, String directory) throws IOException {
        log.debug("Uploading file: {} to directory: {}", file.getOriginalFilename(), directory);
        
        validateFile(file);
        
        String fileName = generateUniqueFileName(file.getOriginalFilename());
        Path uploadPath = getUploadPath(directory);
        
        // Create directory if it doesn't exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        String relativePath = directory + "/" + fileName;
        log.debug("File uploaded successfully: {}", relativePath);
        
        return relativePath;
    }

    /**
     * Upload multiple files
     */
    public List<String> uploadFiles(MultipartFile[] files, String directory) throws IOException {
        log.debug("Uploading {} files to directory: {}", files.length, directory);
        
        return Arrays.stream(files)
            .map(file -> {
                try {
                    return uploadFile(file, directory);
                } catch (IOException e) {
                    log.error("Failed to upload file: {}", file.getOriginalFilename(), e);
                    throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
                }
            })
            .toList();
    }

    /**
     * Upload product image
     */
    public String uploadProductImage(MultipartFile file, Long productId) throws IOException {
        log.debug("Uploading product image for product: {}", productId);
        
        validateImageFile(file);
        
        String directory = "products/" + productId;
        return uploadFile(file, directory);
    }

    /**
     * Upload multiple product images
     */
    public List<String> uploadProductImages(MultipartFile[] files, Long productId) throws IOException {
        log.debug("Uploading {} product images for product: {}", files.length, productId);
        
        // Validate each file
        for (MultipartFile file : files) {
            validateImageFile(file);
        }
        
        String directory = "products/" + productId;
        return uploadFiles(files, directory);
    }

    /**
     * Upload user avatar
     */
    public String uploadUserAvatar(MultipartFile file, Long userId) throws IOException {
        log.debug("Uploading avatar for user: {}", userId);
        
        validateImageFile(file);
        
        String directory = "users/" + userId;
        return uploadFile(file, directory);
    }

    /**
     * Upload company logo
     */
    public String uploadCompanyLogo(MultipartFile file, Long companyId) throws IOException {
        log.debug("Uploading logo for company: {}", companyId);
        
        validateImageFile(file);
        
        String directory = "companies/" + companyId;
        return uploadFile(file, directory);
    }

    /**
     * Upload transaction document
     */
    public String uploadTransactionDocument(MultipartFile file, Long transactionId) throws IOException {
        log.debug("Uploading document for transaction: {}", transactionId);
        
        validateDocumentFile(file);
        
        String directory = "transactions/" + transactionId;
        return uploadFile(file, directory);
    }

    /**
     * Delete a file
     */
    public boolean deleteFile(String filePath) {
        log.debug("Deleting file: {}", filePath);
        
        try {
            Path path = getUploadPath("").resolve(filePath);
            boolean deleted = Files.deleteIfExists(path);
            
            if (deleted) {
                log.debug("File deleted successfully: {}", filePath);
            } else {
                log.warn("File not found for deletion: {}", filePath);
            }
            
            return deleted;
        } catch (IOException e) {
            log.error("Failed to delete file: {}", filePath, e);
            return false;
        }
    }

    /**
     * Delete multiple files
     */
    public void deleteFiles(List<String> filePaths) {
        log.debug("Deleting {} files", filePaths.size());
        
        filePaths.forEach(this::deleteFile);
    }

    /**
     * Get file URL
     */
    public String getFileUrl(String filePath) {
        // In a real application, this would return the full URL to access the file
        // For example, if using cloud storage, it would return the cloud URL
        return "/api/files/" + filePath;
    }

    /**
     * Get file URLs for multiple files
     */
    public List<String> getFileUrls(List<String> filePaths) {
        return filePaths.stream()
            .map(this::getFileUrl)
            .toList();
    }

    /**
     * Check if file exists
     */
    public boolean fileExists(String filePath) {
        Path path = getUploadPath("").resolve(filePath);
        return Files.exists(path);
    }

    /**
     * Get file size
     */
    public long getFileSize(String filePath) throws IOException {
        Path path = getUploadPath("").resolve(filePath);
        return Files.size(path);
    }

    /**
     * Get file content type
     */
    public String getFileContentType(String filePath) throws IOException {
        Path path = getUploadPath("").resolve(filePath);
        return Files.probeContentType(path);
    }

    /**
     * Validate file
     */
    private void validateFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IOException("File is empty");
        }
        
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IOException("File size exceeds maximum allowed size: " + MAX_FILE_SIZE + " bytes");
        }
        
        String contentType = file.getContentType();
        if (contentType == null) {
            throw new IOException("File content type is unknown");
        }
        
        log.debug("File validation passed: {} ({})", file.getOriginalFilename(), contentType);
    }

    /**
     * Validate image file
     */
    private void validateImageFile(MultipartFile file) throws IOException {
        validateFile(file);
        
        String contentType = file.getContentType();
        if (!ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new IOException("Invalid image type: " + contentType + 
                                ". Allowed types: " + ALLOWED_IMAGE_TYPES);
        }
        
        log.debug("Image validation passed: {}", file.getOriginalFilename());
    }

    /**
     * Validate document file
     */
    private void validateDocumentFile(MultipartFile file) throws IOException {
        validateFile(file);
        
        String contentType = file.getContentType();
        if (!ALLOWED_DOCUMENT_TYPES.contains(contentType)) {
            throw new IOException("Invalid document type: " + contentType + 
                                ". Allowed types: " + ALLOWED_DOCUMENT_TYPES);
        }
        
        log.debug("Document validation passed: {}", file.getOriginalFilename());
    }

    /**
     * Generate unique file name
     */
    private String generateUniqueFileName(String originalFilename) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        String extension = getFileExtension(originalFilename);
        
        return timestamp + "_" + uuid + extension;
    }

    /**
     * Get file extension
     */
    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        
        return filename.substring(lastDotIndex);
    }

    /**
     * Get upload path
     */
    private Path getUploadPath(String directory) {
        // In a real application, this would come from configuration
        String uploadDir = System.getProperty("java.io.tmpdir") + "/surplus360/uploads";
        
        if (directory != null && !directory.isEmpty()) {
            uploadDir = uploadDir + "/" + directory;
        }
        
        return Paths.get(uploadDir);
    }

    /**
     * Clean up temporary files
     */
    public void cleanupTemporaryFiles(int daysOld) {
        log.debug("Cleaning up temporary files older than {} days", daysOld);
        
        try {
            Path uploadPath = getUploadPath("");
            if (!Files.exists(uploadPath)) {
                return;
            }
            
            long cutoffTime = System.currentTimeMillis() - (daysOld * 24 * 60 * 60 * 1000L);
            
            Files.walk(uploadPath)
                .filter(Files::isRegularFile)
                .filter(path -> {
                    try {
                        return Files.getLastModifiedTime(path).toMillis() < cutoffTime;
                    } catch (IOException e) {
                        log.error("Error checking file modification time: {}", path, e);
                        return false;
                    }
                })
                .forEach(path -> {
                    try {
                        Files.delete(path);
                        log.debug("Deleted old file: {}", path);
                    } catch (IOException e) {
                        log.error("Error deleting old file: {}", path, e);
                    }
                });
                
        } catch (IOException e) {
            log.error("Error cleaning up temporary files", e);
        }
    }

    /**
     * Get upload statistics
     */
    public UploadStatistics getUploadStatistics() {
        log.debug("Getting upload statistics");
        
        try {
            Path uploadPath = getUploadPath("");
            if (!Files.exists(uploadPath)) {
                return UploadStatistics.builder()
                    .totalFiles(0)
                    .totalSize(0)
                    .build();
            }
            
            long[] stats = Files.walk(uploadPath)
                .filter(Files::isRegularFile)
                .mapToLong(path -> {
                    try {
                        return Files.size(path);
                    } catch (IOException e) {
                        log.error("Error getting file size: {}", path, e);
                        return 0;
                    }
                })
                .collect(
                    () -> new long[]{0, 0}, // [count, totalSize]
                    (acc, size) -> {
                        acc[0]++;
                        acc[1] += size;
                    },
                    (acc1, acc2) -> {
                        acc1[0] += acc2[0];
                        acc1[1] += acc2[1];
                    }
                );
            
            return UploadStatistics.builder()
                .totalFiles(stats[0])
                .totalSize(stats[1])
                .build();
                
        } catch (IOException e) {
            log.error("Error getting upload statistics", e);
            return UploadStatistics.builder()
                .totalFiles(0)
                .totalSize(0)
                .build();
        }
    }

    /**
     * Upload statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class UploadStatistics {
        private long totalFiles;
        private long totalSize;
    }
}