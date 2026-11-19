#pragma once
// Appointment booking store and the ward-console queue order.
//
// Web app: src/context/AppointmentsContext.jsx (the store, saved in the
// browser's localStorage) and src/pages/WardDashboard.jsx (the queue order).
// Here the store is saved to a tab-separated text file instead.
#include <algorithm>
#include <chrono>
#include <fstream>
#include <regex>
#include <sstream>
#include <string>
#include <utility>
#include <vector>

namespace mediverse {

enum class Status { Confirmed, Cancelled };

inline std::string toString(Status s) { return s == Status::Confirmed ? "confirmed" : "cancelled"; }
inline Status statusFrom(const std::string& s) { return s == "cancelled" ? Status::Cancelled : Status::Confirmed; }

struct Appointment {
    std::string id;
    std::string patientName;
    std::string patientEmail;
    std::string hospitalId;    // which hospital's ward console shows this booking
    std::string hospitalName;
    std::string department;
    std::string doctorId;
    std::string doctorName;
    std::string date;          // "YYYY-MM-DD"
    std::string slot;          // e.g. "9:00 AM"
    Status status = Status::Confirmed;
};

// "9:00 AM" -> 540 (minutes since midnight). Unreadable text -> 0.
// Needed because comparing the text would put "9:00 AM" after "10:30 AM".
inline int slotToMinutes(const std::string& slot) {
    static const std::regex pattern(R"(^\s*(\d{1,2}):(\d{2})\s*(AM|PM)\s*$)", std::regex::icase);
    std::smatch m;
    if (!std::regex_match(slot, m, pattern)) return 0;
    int hour = std::stoi(m[1].str()) % 12;           // 12 AM -> 0, 12 PM -> 0 (+12 below)
    if (m[3].str()[0] == 'P' || m[3].str()[0] == 'p') hour += 12;
    return hour * 60 + std::stoi(m[2].str());
}

// Ward queue order: confirmed first, then by date, then by real clock time.
inline std::vector<Appointment> sortForWard(std::vector<Appointment> list) {
    std::sort(list.begin(), list.end(), [](const Appointment& a, const Appointment& b) {
        if (a.status != b.status) return a.status == Status::Confirmed;
        if (a.date != b.date) return a.date < b.date;
        return slotToMinutes(a.slot) < slotToMinutes(b.slot);
    });
    return list;
}

class AppointmentStore {
public:
    explicit AppointmentStore(std::string file) : file_(std::move(file)) { load(); }

    // Adds a confirmed booking (newest first), saves, and returns it.
    const Appointment& book(Appointment a) {
        a.id = "a-" + std::to_string(nowMillis()) + "-" + std::to_string(++counter_);
        a.status = Status::Confirmed;
        list_.insert(list_.begin(), std::move(a));
        save();
        return list_.front();
    }

    bool setStatus(const std::string& id, Status status) {
        for (Appointment& a : list_) {
            if (a.id == id) {
                a.status = status;
                save();
                return true;
            }
        }
        return false;
    }

    bool cancel(const std::string& id) { return setStatus(id, Status::Cancelled); }

    // Bookings made at one hospital: what its ward console shows.
    std::vector<Appointment> forHospital(const std::string& hospitalId) const {
        std::vector<Appointment> out;
        for (const Appointment& a : list_)
            if (a.hospitalId == hospitalId) out.push_back(a);
        return out;
    }

    // One patient's own bookings, matched by the email they signed in with.
    std::vector<Appointment> forPatient(const std::string& email) const {
        std::vector<Appointment> out;
        for (const Appointment& a : list_)
            if (!a.patientEmail.empty() && a.patientEmail == email) out.push_back(a);
        return out;
    }

    const std::vector<Appointment>& all() const { return list_; }

private:
    static long long nowMillis() {
        using namespace std::chrono;
        return duration_cast<milliseconds>(system_clock::now().time_since_epoch()).count();
    }

    // Tabs and line breaks would break the file format, so replace them.
    static std::string clean(std::string s) {
        std::replace(s.begin(), s.end(), '\t', ' ');
        std::replace(s.begin(), s.end(), '\n', ' ');
        return s;
    }

    void save() const {
        std::ofstream out(file_);
        for (const Appointment& a : list_) {
            out << clean(a.id) << '\t' << clean(a.patientName) << '\t' << clean(a.patientEmail) << '\t'
                << clean(a.hospitalId) << '\t' << clean(a.hospitalName) << '\t' << clean(a.department) << '\t'
                << clean(a.doctorId) << '\t' << clean(a.doctorName) << '\t' << clean(a.date) << '\t'
                << clean(a.slot) << '\t' << toString(a.status) << '\n';
        }
    }

    void load() {
        std::ifstream in(file_);  // no file yet = empty store
        std::string line;
        while (std::getline(in, line)) {
            std::vector<std::string> f;
            std::stringstream fields(line);
            std::string field;
            while (std::getline(fields, field, '\t')) f.push_back(field);
            if (f.size() != 11) continue;            // skip a damaged line instead of crashing
            if (f[0] == "seed-vrh-1") continue;      // old demo booking, dropped like in the web app
            list_.push_back({f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8], f[9], statusFrom(f[10])});
        }
    }

    std::string file_;
    std::vector<Appointment> list_;
    int counter_ = 0;
};

}  // namespace mediverse
