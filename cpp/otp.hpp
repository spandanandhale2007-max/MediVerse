#pragma once
// Patient sign-in with a one-time 6-digit code.
//
// Web app: src/lib/otp.js. The patient enters an email, gets a code, and types
// it back. In the demo build the code is shown on screen instead of emailed.
#include <map>
#include <random>
#include <regex>
#include <string>

#include "text.hpp"

namespace mediverse {

// "  Spandan@Gmail.com " and "spandan@gmail.com" must be the same account.
inline std::string normaliseEmail(const std::string& email) { return toLower(trim(email)); }

// Same rule as the web app: something@something.letters (2+ letters at the end).
inline bool isValidEmail(const std::string& email) {
    static const std::regex pattern(R"(^[^\s@]+@[^\s@]+\.[a-z]{2,}$)", std::regex::icase);
    return std::regex_match(trim(email), pattern);
}

// Random code from 100000 to 999999, so it always has exactly 6 digits.
inline std::string generateCode() {
    static std::mt19937 engine{std::random_device{}()};
    std::uniform_int_distribution<int> digits(100000, 999999);
    return std::to_string(digits(engine));
}

class OtpStore {
public:
    // Creates a code for this email and returns it (the demo shows it on screen).
    std::string request(const std::string& email) {
        std::string code = generateCode();
        pending_[normaliseEmail(email)] = code;
        return code;
    }

    // True if the code matches. A code works only once.
    bool confirm(const std::string& email, const std::string& code) {
        const auto it = pending_.find(normaliseEmail(email));
        if (it == pending_.end() || it->second != code) return false;
        pending_.erase(it);
        return true;
    }

private:
    std::map<std::string, std::string> pending_;  // email -> code waiting to be used
};

}  // namespace mediverse
