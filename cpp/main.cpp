// MediVerse core logic in C++: a walkthrough that runs every module and checks
// it behaves like the web app.
//
// Build and run (GCC):
//   g++ -std=c++17 -Wall -Wextra -O2 main.cpp -o mediverse
//   Windows: .\mediverse.exe      Mac / Linux: ./mediverse
#include <cstdio>
#include <cstdlib>
#include <iomanip>
#include <iostream>
#include <string>

#include "appointments.hpp"
#include "auth.hpp"
#include "beds.hpp"
#include "hospitals.hpp"
#include "otp.hpp"
#include "sha256.hpp"

using namespace mediverse;

namespace {

int checks = 0;
int failures = 0;

void check(bool ok, const std::string& what) {
    ++checks;
    if (!ok) ++failures;
    std::cout << (ok ? "  [PASS] " : "  [FAIL] ") << what << '\n';
}

void heading(const std::string& title) { std::cout << "\n== " << title << " ==\n"; }

void printAppointment(const Appointment& a) {
    std::cout << "    " << std::left << std::setw(10) << toString(a.status) << a.date << "  " << std::setw(9)
              << a.slot << a.patientName << '\n';
}

}  // namespace

int main() {
    heading("1. SHA-256 (password hashing)");
    check(sha256Hex("") == "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
          "standard test vector: empty text");
    check(sha256Hex("abc") == "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
          "standard test vector: \"abc\"");
    check(sha256Hex("vishwaraj@123") == "561d45f60d8105310b1b657172ada8f0869de9544350bbf0859ece1d6bf81324",
          "same hash the web app stores for the vishwaraj login");

    heading("2. Staff / admin sign-in");
    const auto ward = verifyStaffCredentials(Role::Staff, "  VishwaRaj ", "vishwaraj@123");
    check(ward.has_value() && ward->hospitalId == "vishwaraj", "vishwaraj signs in (username ignores case and spaces)");
    if (ward) std::cout << "    signed in as: " << ward->name << " (hospital: " << ward->hospitalId << ")\n";
    check(verifyStaffCredentials(Role::Staff, "WARD-101", "Ward@123").has_value(), "WARD-101 signs in");
    check(!verifyStaffCredentials(Role::Staff, "vishwaraj", "wrong-password"), "wrong password is rejected");
    check(!verifyStaffCredentials(Role::Admin, "vishwaraj", "vishwaraj@123"),
          "a ward login cannot open the admin panel");
    if (std::getenv("MEDIVERSE_ADMIN_SHA256") == nullptr)
        check(!verifyStaffCredentials(Role::Admin, "admin@example.com", ""),
              "admin fails closed when no password hash is configured");

    heading("3. Patient sign-in with a 6-digit code");
    check(isValidEmail("  Student@College.in "), "valid email accepted (spaces and capitals are fine)");
    check(!isValidEmail("student.college.in"), "email without @ rejected");
    check(!isValidEmail("student@college.c"), "domain ending needs 2+ letters");
    OtpStore otp;
    const std::string code = otp.request("Student@College.in");
    std::cout << "    code shown on screen: " << code << '\n';
    check(code.size() == 6, "code has 6 digits");
    check(!otp.confirm("student@college.in", "000000"), "wrong code rejected");
    check(otp.confirm("  STUDENT@college.in", code), "right code accepted (email is normalised first)");
    check(!otp.confirm("student@college.in", code), "a code works only once");

    heading("4. Appointments and the ward queue");
    const std::string file = "mediverse-appointments.tsv";
    std::remove(file.c_str());  // start the demo from an empty store
    {
        AppointmentStore store(file);
        Appointment base;
        base.hospitalId = "vishwaraj";
        base.hospitalName = "VishwaRaj Hospital, Loni Kalbhor";
        base.department = "Cardiology";
        base.doctorId = "vrh1";
        base.doctorName = "Dr. Aditi Kulkarni";
        base.date = "2026-09-30";

        auto bookFor = [&](const std::string& name, const std::string& email, const std::string& slot) {
            Appointment a = base;
            a.patientName = name;
            a.patientEmail = email;
            a.slot = slot;
            return store.book(a).id;
        };
        bookFor("Riya Patil", "riya@college.in", "10:30 AM");
        bookFor("Aman Shah", "aman@college.in", "9:00 AM");
        const std::string cancelled = bookFor("Neha Joshi", "neha@college.in", "12:00 PM");
        bookFor("Kabir Rao", "kabir@college.in", "2:00 PM");

        Appointment elsewhere = base;
        elsewhere.hospitalId = "p1";
        elsewhere.hospitalName = "Ruby Hall Clinic";
        elsewhere.patientName = "Sara Khan";
        elsewhere.slot = "9:00 AM";
        store.book(elsewhere);

        store.cancel(cancelled);

        const auto queue = sortForWard(store.forHospital("vishwaraj"));
        std::cout << "    VishwaRaj ward queue:\n";
        for (const Appointment& a : queue) printAppointment(a);
        check(queue.size() == 4, "ward sees only its own hospital's bookings");
        check(queue.size() == 4 && queue[0].slot == "9:00 AM" && queue[1].slot == "10:30 AM" &&
                  queue[2].slot == "2:00 PM",
              "confirmed bookings in real clock order (9:00 AM before 10:30 AM)");
        check(!queue.empty() && queue.back().status == Status::Cancelled, "cancelled booking moves to the end");
        check(slotToMinutes("12:30 PM") == 750 && slotToMinutes("12:00 AM") == 0 && slotToMinutes("5:00 PM") == 1020,
              "12 PM, 12 AM and PM times converted correctly");
        check(store.forPatient("riya@college.in").size() == 1, "a patient sees only their own booking");
    }
    const AppointmentStore reloaded(file);
    check(reloaded.all().size() == 5, "bookings survive a restart (saved to " + file + ")");

    heading("5. Bed availability");
    BedAvailability beds;
    check(beds.get("vishwaraj") == 100, "a hospital starts at 100 free beds");
    check(beds.set("vishwaraj", 97.6) == 98, "decimals are rounded (97.6 -> 98)");
    check(beds.set("vishwaraj", -5) == 0, "negative numbers become 0");
    check(beds.setFromText("vishwaraj", "12abc") == 0, "unreadable text counts as 0 (like the web app)");
    check(beds.setFromText("vishwaraj", " 42 ") == 42, "typed \" 42 \" is read as 42");
    check(beds.get("p1") == 100, "each hospital keeps its own count");
    check(beds.reset("vishwaraj") == 100 && beds.isDefault("vishwaraj"), "reset goes back to 100");

    heading("6. Hospital directory");
    const auto& all = sampleHospitals();
    const auto dhule = filterHospitals(all, {"Maharashtra", "Dhule", ""});
    std::cout << "    Dhule:\n";
    for (const Hospital& h : dhule) std::cout << "      " << h.name << "  [" << labelFor(h.verified).label << "]\n";
    check(dhule.size() == 2, "state + city filter finds Dhule's 2 sample hospitals");
    const auto civil = filterHospitals(all, {"All", "All", "  CIVIL "});
    check(civil.size() == 1 && civil[0].id == "dhl2", "search ignores case and spaces (\"civil\")");
    const auto loni = filterHospitals(all, {"Maharashtra", "Pune", "loni"});
    check(loni.size() == 1 && loni[0].id == "p28", "search also matches the area (\"loni\" -> VishwaRaj)");
    if (!loni.empty()) {
        const std::string url = mapsDirectionsUrl(loni[0]);
        std::cout << "    directions: " << url << '\n';
        check(url.find("VishwaRaj%20Hospital%2C%20Near%20Loni") != std::string::npos,
              "maps link is encoded like encodeURIComponent");
    }

    std::cout << '\n' << (checks - failures) << " of " << checks << " checks passed.\n";
    return failures == 0 ? 0 : 1;
}
