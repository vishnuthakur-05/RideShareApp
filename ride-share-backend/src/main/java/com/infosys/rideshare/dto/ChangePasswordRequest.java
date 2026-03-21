package com.infosys.rideshare.dto;

import lombok.Data;

@Data
public class ChangePasswordRequest {
    private String email;
    private String newPassword;
}
