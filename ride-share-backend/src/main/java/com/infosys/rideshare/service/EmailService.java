package com.infosys.rideshare.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendApprovalEmail(String toEmail, String userName, String tempPassword, String loginUrl) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Your Ride Share Account Has Been Approved");

            String body = String.format("""
                    Dear %s,

                    Congratulations! Your Ride Share account has been successfully approved.

                    You can now log in using the following credentials:

                    Registered Email: %s
                    Temporary Password: %s

                    Login here: %s

                    For security reasons, please change your password after your first login.

                    If you have any questions, contact our support team.

                    Welcome to Ride Share!
                    """, userName, toEmail, tempPassword, loginUrl);

            message.setText(body);

            mailSender.send(message);
            System.out.println("Approval email sent successfully to: " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send approval email to: " + toEmail);
            e.printStackTrace();
        }
    }
}
