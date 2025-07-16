package com.surplus360.web.rest;

import com.surplus360.service.FileUploadService;
import com.surplus360.web.rest.errors.BadRequestAlertException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Slf4j
public class FileUploadController {

    private final FileUploadService fileUploadService;

    /**
     * POST /files/upload : Upload a single file
     */
    @PostMapping("/upload")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> uploadFile(
        @RequestParam("file") MultipartFile file,
        @RequestParam("directory") String directory
    ) {
        log.debug("REST request to upload file: {} to directory: {}", file.getOriginalFilename(), directory);
        
        try {
            String filePath = fileUploadService.uploadFile(file, directory);
            String fileUrl = fileUploadService.getFileUrl(filePath);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("filePath", filePath);
            response.put("fileUrl", fileUrl);
            response.put("fileName", file.getOriginalFilename());
            response.put("fileSize", file.getSize());
            response.put("contentType", file.getContentType());
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Failed to upload file: {}", file.getOriginalFilename(), e);
            throw new BadRequestAlertException("Failed to upload file: " + e.getMessage(), "file", "uploadfailed");
        }
    }

    /**
     * POST /files/upload-multiple : Upload multiple files
     */
    @PostMapping("/upload-multiple")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> uploadMultipleFiles(
        @RequestParam("files") MultipartFile[] files,
        @RequestParam("directory") String directory
    ) {
        log.debug("REST request to upload {} files to directory: {}", files.length, directory);
        
        try {
            List<String> filePaths = fileUploadService.uploadFiles(files, directory);
            List<String> fileUrls = fileUploadService.getFileUrls(filePaths);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("filePaths", filePaths);
            response.put("fileUrls", fileUrls);
            response.put("uploadedCount", filePaths.size());
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Failed to upload files", e);
            throw new BadRequestAlertException("Failed to upload files: " + e.getMessage(), "file", "uploadfailed");
        }
    }

    /**
     * POST /files/product/{productId}/images : Upload product images
     */
    @PostMapping("/product/{productId}/images")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> uploadProductImages(
        @PathVariable Long productId,
        @RequestParam("images") MultipartFile[] images
    ) {
        log.debug("REST request to upload product images for product: {}", productId);
        
        try {
            List<String> filePaths = fileUploadService.uploadProductImages(images, productId);
            List<String> fileUrls = fileUploadService.getFileUrls(filePaths);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("filePaths", filePaths);
            response.put("fileUrls", fileUrls);
            response.put("productId", productId);
            response.put("uploadedCount", filePaths.size());
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Failed to upload product images for product: {}", productId, e);
            throw new BadRequestAlertException("Failed to upload product images: " + e.getMessage(), "file", "uploadfailed");
        }
    }

    /**
     * POST /files/user/{userId}/avatar : Upload user avatar
     */
    @PostMapping("/user/{userId}/avatar")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> uploadUserAvatar(
        @PathVariable Long userId,
        @RequestParam("avatar") MultipartFile avatar
    ) {
        log.debug("REST request to upload avatar for user: {}", userId);
        
        try {
            String filePath = fileUploadService.uploadUserAvatar(avatar, userId);
            String fileUrl = fileUploadService.getFileUrl(filePath);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("filePath", filePath);
            response.put("fileUrl", fileUrl);
            response.put("userId", userId);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Failed to upload avatar for user: {}", userId, e);
            throw new BadRequestAlertException("Failed to upload avatar: " + e.getMessage(), "file", "uploadfailed");
        }
    }

    /**
     * POST /files/company/{companyId}/logo : Upload company logo
     */
    @PostMapping("/company/{companyId}/logo")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> uploadCompanyLogo(
        @PathVariable Long companyId,
        @RequestParam("logo") MultipartFile logo
    ) {
        log.debug("REST request to upload logo for company: {}", companyId);
        
        try {
            String filePath = fileUploadService.uploadCompanyLogo(logo, companyId);
            String fileUrl = fileUploadService.getFileUrl(filePath);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("filePath", filePath);
            response.put("fileUrl", fileUrl);
            response.put("companyId", companyId);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Failed to upload logo for company: {}", companyId, e);
            throw new BadRequestAlertException("Failed to upload logo: " + e.getMessage(), "file", "uploadfailed");
        }
    }

    /**
     * POST /files/transaction/{transactionId}/document : Upload transaction document
     */
    @PostMapping("/transaction/{transactionId}/document")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> uploadTransactionDocument(
        @PathVariable Long transactionId,
        @RequestParam("document") MultipartFile document
    ) {
        log.debug("REST request to upload document for transaction: {}", transactionId);
        
        try {
            String filePath = fileUploadService.uploadTransactionDocument(document, transactionId);
            String fileUrl = fileUploadService.getFileUrl(filePath);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("filePath", filePath);
            response.put("fileUrl", fileUrl);
            response.put("transactionId", transactionId);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            log.error("Failed to upload document for transaction: {}", transactionId, e);
            throw new BadRequestAlertException("Failed to upload document: " + e.getMessage(), "file", "uploadfailed");
        }
    }

    /**
     * GET /files/{directory}/{filename} : Serve uploaded files
     */
    @GetMapping("/{directory}/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String directory, @PathVariable String filename) {
        log.debug("REST request to serve file: {}/{}", directory, filename);
        
        try {
            String filePath = directory + "/" + filename;
            
            if (!fileUploadService.fileExists(filePath)) {
                throw new BadRequestAlertException("File not found", "file", "notfound");
            }
            
            // Get file as resource
            Path file = Paths.get(System.getProperty("java.io.tmpdir"), "surplus360", "uploads", directory, filename);
            Resource resource = new UrlResource(file.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                throw new BadRequestAlertException("File not found or not readable", "file", "notfound");
            }
            
            // Determine content type
            String contentType = fileUploadService.getFileContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
                
        } catch (MalformedURLException e) {
            log.error("Malformed URL for file: {}/{}", directory, filename, e);
            throw new BadRequestAlertException("Invalid file path", "file", "invalidpath");
        } catch (IOException e) {
            log.error("IO error serving file: {}/{}", directory, filename, e);
            throw new BadRequestAlertException("Error serving file", "file", "serveerror");
        }
    }

    /**
     * DELETE /files/{filePath} : Delete a file
     */
    @DeleteMapping("/{filePath:.+}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, Object>> deleteFile(@PathVariable String filePath) {
        log.debug("REST request to delete file: {}", filePath);
        
        boolean deleted = fileUploadService.deleteFile(filePath);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", deleted);
        response.put("filePath", filePath);
        
        if (!deleted) {
            response.put("message", "File not found or could not be deleted");
        }
        
        return ResponseEntity.ok(response);
    }

    /**
     * GET /files/statistics : Get file upload statistics
     */
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FileUploadService.UploadStatistics> getUploadStatistics() {
        log.debug("REST request to get file upload statistics");
        
        FileUploadService.UploadStatistics statistics = fileUploadService.getUploadStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * POST /files/cleanup : Clean up old files
     */
    @PostMapping("/cleanup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> cleanupOldFiles(@RequestParam(defaultValue = "30") int daysOld) {
        log.debug("REST request to cleanup files older than {} days", daysOld);
        
        fileUploadService.cleanupTemporaryFiles(daysOld);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Cleanup completed for files older than " + daysOld + " days");
        
        return ResponseEntity.ok(response);
    }
}