#pragma once
// Small string helpers shared by the other modules. JavaScript has these built
// in (s.trim(), s.toLowerCase(), s.includes()); C++ needs them written out.
#include <algorithm>
#include <cctype>
#include <string>

namespace mediverse {

// Remove spaces, tabs and line breaks from both ends (JS: s.trim()).
inline std::string trim(const std::string& s) {
    const auto first = s.find_first_not_of(" \t\r\n");
    if (first == std::string::npos) return "";
    const auto last = s.find_last_not_of(" \t\r\n");
    return s.substr(first, last - first + 1);
}

// Lower-case copy of s (JS: s.toLowerCase()).
inline std::string toLower(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(),
                   [](unsigned char c) { return static_cast<char>(std::tolower(c)); });
    return s;
}

// Case-insensitive "does haystack contain needle"
// (JS: haystack.toLowerCase().includes(needle.toLowerCase())).
inline bool containsIgnoreCase(const std::string& haystack, const std::string& needle) {
    return toLower(haystack).find(toLower(needle)) != std::string::npos;
}

}  // namespace mediverse
