#pragma once
// Roles and staff/admin sign-in.
//
// Web app: src/lib/auth.js. Three roles (Patient, Doctor/Ward, Admin). Staff and
// admin sign in with a username + password that is checked against a stored
// SHA-256 hash. Patients sign in with an email code instead (see otp.hpp).
#include <cstdlib>
#include <optional>
#include <string>
#include <vector>

#include "sha256.hpp"
#include "text.hpp"

namespace mediverse {

enum class Role { Patient, Staff, Admin };

enum class SignInMethod { EmailCode, Credentials };

struct RoleInfo {
    Role role;
    std::string label;    // text on the "How are you signing in?" screen
    SignInMethod method;
    std::string home;     // page the role lands on after sign-in
};

inline const std::vector<RoleInfo>& roles() {
    static const std::vector<RoleInfo> list = {
        {Role::Patient, "Patient", SignInMethod::EmailCode, "/"},
        {Role::Staff, "Doctor / Ward", SignInMethod::Credentials, "/ward"},
        {Role::Admin, "Admin", SignInMethod::Credentials, "/admin"},
    };
    return list;
}

struct Account {
    Role role;
    std::string userId;
    std::string passwordHash;  // SHA-256 hex; empty means "not configured"
    std::string name;
    std::string hospitalId;    // empty means network-wide (all hospitals)
};

struct SignedInUser {
    Role role;
    std::string userId;
    std::string name;
    std::string hospitalId;
};

// Environment variable, or a fallback if it is missing or empty.
inline std::string envOr(const char* key, const std::string& fallback) {
    const char* value = std::getenv(key);
    return (value != nullptr && *value != '\0') ? value : fallback;
}

inline std::vector<Account> demoAccounts() {
    return {
        {Role::Staff, "vishwaraj", "561d45f60d8105310b1b657172ada8f0869de9544350bbf0859ece1d6bf81324",
         "VishwaRaj Hospital - Ward Desk", "vishwaraj"},
        {Role::Staff, "WARD-101", "242f99222d56df85f0daefb86a79697588b595c18661c15f2fcbec5c2887c4a5",
         "Ward Desk - 1st Floor", ""},
        {Role::Staff, "DOC-204", "87b6cad54af872d1632baf0b418b5d88ecde80c364b73668c036da565cd384ce",
         "Dr. On-Call, General Medicine", ""},
        // Admin details come from the environment (VITE_ADMIN_* in the web app),
        // so the admin password is never written in the source code.
        {Role::Admin, envOr("MEDIVERSE_ADMIN_EMAIL", "admin@example.com"), envOr("MEDIVERSE_ADMIN_SHA256", ""),
         "MediVerse Admin", ""},
    };
}

// Returns the signed-in user, or std::nullopt if the details are wrong.
inline std::optional<SignedInUser> verifyStaffCredentials(Role role, const std::string& userId,
                                                          const std::string& password) {
    const std::string wanted = toLower(trim(userId));
    for (const Account& account : demoAccounts()) {
        if (account.role != role || toLower(account.userId) != wanted) continue;
        // An unconfigured hash must fail closed, never match an empty password.
        if (account.passwordHash.empty()) return std::nullopt;
        if (sha256Hex(password) != account.passwordHash) return std::nullopt;
        return SignedInUser{account.role, account.userId, account.name, account.hospitalId};
    }
    return std::nullopt;
}

}  // namespace mediverse
