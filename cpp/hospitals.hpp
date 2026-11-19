#pragma once
// Hospital directory: records, verification badges, search filter, map links.
//
// Web app: src/data/hospitals.js (the 246 records + helpers) and
// src/pages/RealHospitals.jsx (the state / city / search filter).
// A few real records are copied here as sample data (dashes made plain ASCII).
#include <cctype>
#include <string>
#include <vector>

#include "text.hpp"

namespace mediverse {

// How far a record's address and phone were checked.
enum class Verification { Direct, Govt, Search, Listings };

struct VerificationLabel {
    const char* label;
    const char* badge;  // colour of the badge in the web UI
};

inline VerificationLabel labelFor(Verification v) {
    switch (v) {
        case Verification::Direct:   return {"Verified on official site", "good"};
        case Verification::Govt:     return {"Listed by district administration", "good"};
        case Verification::Search:   return {"From official site via search", "neutral"};
        case Verification::Listings: return {"Third-party listings only", "warning"};
    }
    return {"Unknown", "neutral"};
}

struct Hospital {
    std::string id;
    std::string name;
    std::string state;
    std::string city;
    std::string area;
    std::string address;
    std::string phone;
    std::string email;    // empty if none published
    std::string website;  // empty if none
    Verification verified;
    std::string note;
};

inline const std::vector<Hospital>& sampleHospitals() {
    static const std::vector<Hospital> list = {
        {"p1", "Ruby Hall Clinic", "Maharashtra", "Pune", "Sassoon Road",
         "40, Sassoon Road, Sangamvadi, Pune, Maharashtra 411001", "+91-20-6645-5100", "",
         "https://rubyhall.com/", Verification::Direct, ""},
        {"p28", "VishwaRaj Hospital", "Maharashtra", "Pune", "Loni Kalbhor",
         "Near Loni Railway Station, Solapur-Pune Highway, Loni Kalbhor, Pune, Maharashtra 412201",
         "+91-20-6760-6060", "info@vrhpune.com", "https://vishwarajhospital.com/", Verification::Direct,
         "Multispecialty hospital (~300 beds) close to MIT ADT University."},
        {"mum1", "Lilavati Hospital & Research Centre", "Maharashtra", "Mumbai", "Bandra West",
         "A-791, Bandra Reclamation, Bandra West, Mumbai, Maharashtra 400050", "022-6931-8000",
         "info@lilavatihospital.com", "https://www.lilavatihospital.com/", Verification::Direct, ""},
        {"dhl1", "Shri Bhausaheb Hire Government Medical College & Hospital", "Maharashtra", "Dhule",
         "Malegaon Road", "Chakkarbardi, Malegaon Road, Samta Nagar, Dhule, Maharashtra 424001", "02562-239407",
         "deangmcdhule@gmail.com", "https://sbhgmcdhule.org/", Verification::Search,
         "Government teaching hospital (established 1989)."},
        {"dhl2", "District Civil Hospital, Dhule", "Maharashtra", "Dhule", "Sakri Road",
         "Sakri Road, in front of the Public Works building, near Santoshi Mata Temple, Dhule, Maharashtra 424001",
         "02562-282875", "", "https://dhule.gov.in/en/civil-hospital-dhule/", Verification::Govt, ""},
        {"jln1", "Government Medical College, Jalna", "Maharashtra", "Jalna", "Ambad-Mantha Road",
         "Opposite Sushila Devi Lawns, Ambad-Mantha Road, Jalna, Maharashtra 431213", "02482-299105",
         "deangmcjalna@gmail.com", "https://www.gmcjalna.org/", Verification::Search,
         "New government medical college (established 2024)."},
        {"jln2", "Jalna Multispeciality Hospital", "Maharashtra", "Jalna", "Satkar Nagar",
         "Satkar Nagar, Ambad Chowfuly, Jalna, Maharashtra 431203", "02482-223551", "info@jalnahospital.com",
         "https://jalnahospital.com/", Verification::Govt, ""},
    };
    return list;
}

// "All" means "don't filter on this". query matches name, area, address or city.
struct HospitalFilter {
    std::string state = "All";
    std::string city = "All";
    std::string query;
};

inline std::vector<Hospital> filterHospitals(const std::vector<Hospital>& all, const HospitalFilter& f) {
    const std::string q = trim(f.query);
    std::vector<Hospital> out;
    for (const Hospital& h : all) {
        if (f.state != "All" && h.state != f.state) continue;
        if (f.city != "All" && h.city != f.city) continue;
        if (!q.empty() && !containsIgnoreCase(h.name, q) && !containsIgnoreCase(h.area, q) &&
            !containsIgnoreCase(h.address, q) && !containsIgnoreCase(h.city, q))
            continue;
        out.push_back(h);
    }
    return out;
}

// Same rules as JavaScript's encodeURIComponent: letters, digits and - _ . ! ~ * ' ( )
// stay as they are; every other byte becomes %XX.
inline std::string encodeURIComponent(const std::string& s) {
    static const char* hex = "0123456789ABCDEF";
    static const std::string safe = "-_.!~*'()";
    std::string out;
    for (unsigned char c : s) {
        if (std::isalnum(c) || safe.find(static_cast<char>(c)) != std::string::npos) {
            out += static_cast<char>(c);
        } else {
            out += '%';
            out += hex[c >> 4];
            out += hex[c & 0x0F];
        }
    }
    return out;
}

// Google Maps directions link used by the "Get directions" button.
inline std::string mapsDirectionsUrl(const Hospital& h) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(h.name + ", " + h.address);
}

}  // namespace mediverse
