package com.erp.backend.dto;

import java.time.LocalDate;

public class UserDTO {

    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String nic;
    private String role;
    private String password;
    private Double salary;
    private LocalDate joinDate;
    private String status;

    public String getUsername() { return username; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getNic() { return nic; }
    public String getRole() { return role; }
    public String getPassword() { return password; }
    public Double getSalary() { return salary; }
    public LocalDate getJoinDate() { return joinDate; }
    public String getStatus() { return status; }

    public void setUsername(String username) { this.username = username; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setNic(String nic) { this.nic = nic; }
    public void setRole(String role) { this.role = role; }
    public void setPassword(String password) { this.password = password; }
    public void setSalary(Double salary) { this.salary = salary; }
    public void setJoinDate(LocalDate joinDate) { this.joinDate = joinDate; }
    public void setStatus(String status) { this.status = status; }
}
