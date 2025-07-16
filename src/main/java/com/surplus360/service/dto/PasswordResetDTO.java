package com.surplus360.service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetDTO {

    @NotNull
    @Size(max = 20)
    private String key;

    @NotNull
    @Size(min = 4, max = 100)
    private String newPassword;
}