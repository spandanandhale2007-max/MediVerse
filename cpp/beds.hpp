#pragma once
// Ward bed availability: one "beds free" number per hospital, default 100.
//
// Web app: src/hooks/useBedAvailability.js. The ward desk can raise or lower
// the count from the console; it never goes below 0 and is always a whole number.
#include <algorithm>
#include <cmath>
#include <exception>
#include <map>
#include <string>

#include "text.hpp"

namespace mediverse {

class BedAvailability {
public:
    static constexpr int kDefaultBeds = 100;

    int get(const std::string& hospitalId) const {
        const auto it = beds_.find(keyFor(hospitalId));
        return it == beds_.end() ? kDefaultBeds : it->second;
    }

    // Clamp to a non-negative whole number (JS: Math.max(0, Math.round(Number(next) || 0))).
    int set(const std::string& hospitalId, double next) {
        if (!std::isfinite(next)) next = 0;
        next = std::clamp(next, 0.0, 1e9);  // keep the value inside int range
        const int value = static_cast<int>(std::lround(next));
        beds_[keyFor(hospitalId)] = value;
        return value;
    }

    // Text typed into the console's number box. Like JS Number(text), the whole
    // text must be a number: "42" -> 42, "12abc" -> 0, "" -> 0.
    int setFromText(const std::string& hospitalId, const std::string& text) {
        const std::string t = trim(text);
        if (t.empty()) return set(hospitalId, 0);
        try {
            std::size_t used = 0;
            const double value = std::stod(t, &used);
            return set(hospitalId, used == t.size() ? value : 0);
        } catch (const std::exception&) {
            return set(hospitalId, 0);
        }
    }

    int reset(const std::string& hospitalId) { return set(hospitalId, kDefaultBeds); }
    bool isDefault(const std::string& hospitalId) const { return get(hospitalId) == kDefaultBeds; }

private:
    static std::string keyFor(const std::string& hospitalId) { return hospitalId.empty() ? "network" : hospitalId; }

    std::map<std::string, int> beds_;  // hospitalId -> beds free
};

}  // namespace mediverse
