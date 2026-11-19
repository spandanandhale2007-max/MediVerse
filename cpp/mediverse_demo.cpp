// MediVerse - Hospital Services: C++ console demo
//
// A one-file version of the MediVerse website's main features, made for
// presentations. It uses only the standard C++ library (C++11 or newer), so it
// builds on Windows, macOS and Linux, in Code::Blocks, Dev-C++, Visual Studio,
// and in online C++ compilers.
//
//   Build:  g++ -std=c++11 mediverse_demo.cpp -o mediverse_demo
//   Run:    Windows:      .\mediverse_demo.exe   (or double-click it)
//           Mac / Linux:  ./mediverse_demo
//
// Demo logins (same as the website):
//   Patient: any email address, then the 6-digit code shown on screen
//   Ward:    vishwaraj / vishwaraj@123

#if !defined(_MSC_VER) && __cplusplus < 201103L
#error "Please compile as C++11 or newer, for example: g++ -std=c++11 mediverse_demo.cpp"
#endif

#include <algorithm>
#include <array>
#include <cctype>
#include <cstddef>
#include <cstdint>
#include <exception>
#include <initializer_list>
#include <iomanip>
#include <iostream>
#include <random>
#include <sstream>
#include <string>
#include <vector>

namespace {  // everything except main() is private to this file

// =================================================================== data

struct Doctor {
    std::string name;
    std::string specialty;
    bool available;  // false = in surgery right now
};

struct Hospital {
    std::string name;
    std::string city;
    std::string area;
    std::string phone;
    std::string verified;  // how the address and phone were checked
};

struct Appointment {
    int id;
    std::string patientName;
    std::string patientEmail;
    std::string doctorName;
    std::string department;
    std::string date;  // YYYY-MM-DD
    std::string slot;  // e.g. "9:00 AM"
    bool cancelled;
};

// Everything the program remembers while it runs.
struct AppState {
    std::string patientEmail;  // empty until a patient signs in
    bool wardLoggedIn = false;
    std::vector<Appointment> appointments;
    int beds = 100;  // beds free, default 100 (like the website)
    int nextId = 1;
};

// VishwaRaj Hospital's demo doctors (website: src/data/mock.js).
const std::vector<Doctor> kDoctors = {
    {"Dr. Aditi Kulkarni", "Cardiology", true},
    {"Dr. Nikhil Deshpande", "Orthopedics", true},
    {"Dr. Sneha Pawar", "General Medicine", true},
    {"Dr. Rohan Jadhav", "Pediatrics", true},
    {"Dr. Meghana Shah", "Gynaecology", false},
    {"Dr. Sameer Patil", "Neurology", true},
};

const std::vector<std::string> kSlots = {"9:00 AM", "10:30 AM", "12:00 PM",
                                         "2:00 PM", "3:30 PM", "5:00 PM"};

// Real hospitals from the website's directory (src/data/hospitals.js).
const std::vector<Hospital> kHospitals = {
    {"Ruby Hall Clinic", "Pune", "Sassoon Road", "+91-20-6645-5100",
     "Verified on official site"},
    {"VishwaRaj Hospital", "Pune", "Loni Kalbhor", "+91-20-6760-6060",
     "Verified on official site"},
    {"Lilavati Hospital & Research Centre", "Mumbai", "Bandra West", "022-6931-8000",
     "Verified on official site"},
    {"Shri Bhausaheb Hire Govt. Medical College & Hospital", "Dhule", "Malegaon Road",
     "02562-239407", "From official site via search"},
    {"District Civil Hospital, Dhule", "Dhule", "Sakri Road", "02562-282875",
     "Listed by district administration"},
    {"Government Medical College, Jalna", "Jalna", "Ambad-Mantha Road", "02482-299105",
     "From official site via search"},
    {"Jalna Multispeciality Hospital", "Jalna", "Satkar Nagar", "02482-223551",
     "Listed by district administration"},
};

// Like the website, only a SHA-256 hash of the ward password is stored,
// never the password itself.
const std::string kWardUser = "vishwaraj";
const std::string kWardPasswordHash =
    "561d45f60d8105310b1b657172ada8f0869de9544350bbf0859ece1d6bf81324";
const std::string kWardName = "VishwaRaj Hospital - Ward Desk";

// =================================================================== text helpers

std::string trim(const std::string& s) {
    const std::size_t first = s.find_first_not_of(" \t\r\n");
    if (first == std::string::npos) return "";
    const std::size_t last = s.find_last_not_of(" \t\r\n");
    return s.substr(first, last - first + 1);
}

std::string toLower(std::string s) {
    for (char& c : s) c = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
    return s;
}

bool containsIgnoreCase(const std::string& text, const std::string& part) {
    return toLower(text).find(toLower(part)) != std::string::npos;
}

bool isAllDigits(const std::string& s) {
    if (s.empty()) return false;
    for (char c : s)
        if (!std::isdigit(static_cast<unsigned char>(c))) return false;
    return true;
}

// =================================================================== SHA-256

std::string sha256Hex(const std::string& input) {
    static const std::array<std::uint32_t, 64> K = {
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4,
        0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe,
        0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f,
        0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
        0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
        0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
        0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116,
        0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7,
        0xc67178f2};
    std::array<std::uint32_t, 8> h = {0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
                                      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19};
    auto rotr = [](std::uint32_t x, int n) { return (x >> n) | (x << (32 - n)); };

    std::string msg = input;
    std::uint64_t bits = input.size();
    bits *= 8;  // message length in bits
    msg.push_back(static_cast<char>(0x80));
    while (msg.size() % 64 != 56) msg.push_back('\0');
    for (int i = 7; i >= 0; --i) msg.push_back(static_cast<char>((bits >> (i * 8)) & 0xff));

    for (std::size_t block = 0; block < msg.size(); block += 64) {
        std::array<std::uint32_t, 64> w = {};
        for (std::size_t i = 0; i < 16; ++i)
            for (std::size_t k = 0; k < 4; ++k)
                w[i] = (w[i] << 8) | static_cast<unsigned char>(msg[block + 4 * i + k]);
        for (std::size_t i = 16; i < 64; ++i) {
            const std::uint32_t s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >> 3);
            const std::uint32_t s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >> 10);
            w[i] = w[i - 16] + s0 + w[i - 7] + s1;
        }
        std::array<std::uint32_t, 8> v = h;  // a, b, c, d, e, f, g, h
        for (std::size_t i = 0; i < 64; ++i) {
            const std::uint32_t t1 = v[7] + (rotr(v[4], 6) ^ rotr(v[4], 11) ^ rotr(v[4], 25)) +
                                     ((v[4] & v[5]) ^ (~v[4] & v[6])) + K[i] + w[i];
            const std::uint32_t t2 = (rotr(v[0], 2) ^ rotr(v[0], 13) ^ rotr(v[0], 22)) +
                                     ((v[0] & v[1]) ^ (v[0] & v[2]) ^ (v[1] & v[2]));
            for (std::size_t j = 7; j > 0; --j) v[j] = v[j - 1];
            v[4] += t1;
            v[0] = t1 + t2;
        }
        for (std::size_t j = 0; j < 8; ++j) h[j] += v[j];
    }
    std::ostringstream out;
    for (std::uint32_t word : h) out << std::hex << std::setw(8) << std::setfill('0') << word;
    return out.str();
}

// =================================================================== core logic

// Same rule as the website: name@domain.ending, no spaces, ending = 2+ letters.
bool isValidEmail(const std::string& raw) {
    const std::string email = trim(raw);
    const std::size_t at = email.find('@');
    if (at == std::string::npos || at == 0 || email.find('@', at + 1) != std::string::npos)
        return false;
    for (char c : email)
        if (std::isspace(static_cast<unsigned char>(c))) return false;
    const std::string domain = email.substr(at + 1);
    const std::size_t dot = domain.rfind('.');
    if (dot == std::string::npos || dot == 0 || domain.size() - dot - 1 < 2) return false;
    for (std::size_t i = dot + 1; i < domain.size(); ++i)
        if (!std::isalpha(static_cast<unsigned char>(domain[i]))) return false;
    return true;
}

// Random 6-digit sign-in code (100000 to 999999).
std::string generateCode() {
    static std::mt19937 engine{std::random_device{}()};
    std::uniform_int_distribution<int> digits(100000, 999999);
    return std::to_string(digits(engine));
}

bool verifyWard(const std::string& user, const std::string& password) {
    return toLower(trim(user)) == kWardUser && sha256Hex(password) == kWardPasswordHash;
}

// "9:00 AM" -> 540 minutes since midnight, so 9:00 AM sorts before 10:30 AM.
int slotToMinutes(const std::string& slot) {
    const std::size_t colon = slot.find(':');
    if (colon == std::string::npos) return 0;
    int hour = std::stoi(slot.substr(0, colon)) % 12;
    const int minute = std::stoi(slot.substr(colon + 1, 2));
    if (containsIgnoreCase(slot, "pm")) hour += 12;
    return hour * 60 + minute;
}

// Checks the shape YYYY-MM-DD with a real month (1-12) and day (1-31).
bool isValidDate(const std::string& d) {
    if (d.size() != 10 || d[4] != '-' || d[7] != '-') return false;
    for (unsigned i : {0u, 1u, 2u, 3u, 5u, 6u, 8u, 9u})
        if (!std::isdigit(static_cast<unsigned char>(d[i]))) return false;
    const int month = std::stoi(d.substr(5, 2));
    const int day = std::stoi(d.substr(8, 2));
    return month >= 1 && month <= 12 && day >= 1 && day <= 31;
}

int book(AppState& state, const std::string& name, const std::string& email, std::size_t doctor,
         const std::string& date, std::size_t slot) {
    const Appointment a = {state.nextId++, name, email, kDoctors[doctor].name,
                           kDoctors[doctor].specialty, date, kSlots[slot], false};
    state.appointments.push_back(a);
    return a.id;
}

bool cancel(AppState& state, int id) {
    for (Appointment& a : state.appointments) {
        if (a.id == id && !a.cancelled) {
            a.cancelled = true;
            return true;
        }
    }
    return false;
}

// Ward queue: confirmed first, then by date, then by real clock time.
std::vector<Appointment> wardQueue(const AppState& state) {
    std::vector<Appointment> list = state.appointments;
    std::sort(list.begin(), list.end(), [](const Appointment& a, const Appointment& b) {
        if (a.cancelled != b.cancelled) return !a.cancelled;
        if (a.date != b.date) return a.date < b.date;
        return slotToMinutes(a.slot) < slotToMinutes(b.slot);
    });
    return list;
}

// Like the website: whole number, never below 0; unreadable text counts as 0.
int setBedsFromText(AppState& state, const std::string& text) {
    int value = 0;
    try {
        std::size_t used = 0;
        const double number = std::stod(trim(text), &used);
        if (used == trim(text).size())
            value = static_cast<int>(std::max(0.0, std::min(number + 0.5, 1e9)));
    } catch (const std::exception&) {
        value = 0;
    }
    state.beds = value;
    return value;
}

std::vector<Hospital> searchHospitals(const std::string& query) {
    std::vector<Hospital> found;
    for (const Hospital& h : kHospitals)
        if (containsIgnoreCase(h.name, query) || containsIgnoreCase(h.city, query) ||
            containsIgnoreCase(h.area, query))
            found.push_back(h);
    return found;
}

// =================================================================== screen (input / output)

struct EndOfInput {};  // thrown when input runs out, so the program can close cleanly

std::string ask(const std::string& prompt) {
    std::cout << prompt;
    std::string line;
    if (!std::getline(std::cin, line)) throw EndOfInput();
    return trim(line);
}

// Asks for a number from 1 to max. Returns -1 if the answer isn't valid.
int askNumber(const std::string& prompt, int max) {
    const std::string answer = ask(prompt);
    if (answer.size() > 3 || !isAllDigits(answer)) return -1;
    const int n = std::stoi(answer);
    return (n >= 1 && n <= max) ? n : -1;
}

void printQueue(const AppState& state) {
    const std::vector<Appointment> queue = wardQueue(state);
    if (queue.empty()) {
        std::cout << "  No appointments booked yet.\n";
        return;
    }
    std::cout << "  " << std::left << std::setw(4) << "#" << std::setw(11) << "Status"
              << std::setw(12) << "Date" << std::setw(10) << "Time" << std::setw(18) << "Patient"
              << "Doctor\n";
    for (const Appointment& a : queue)
        std::cout << "  " << std::setw(4) << a.id << std::setw(11)
                  << (a.cancelled ? "Cancelled" : "Confirmed") << std::setw(12) << a.date
                  << std::setw(10) << a.slot << std::setw(18) << a.patientName << a.doctorName
                  << '\n';
}

void patientSignIn(AppState& state) {
    std::cout << "\n--- Patient sign-in ---\n";
    const std::string email = ask("Email: ");
    if (!isValidEmail(email)) {
        std::cout << "That doesn't look like an email address.\n";
        return;
    }
    const std::string code = generateCode();
    std::cout << "Demo mode: no email is sent. Your code is " << code << ".\n";
    if (ask("Enter the 6-digit code: ") == code) {
        state.patientEmail = toLower(trim(email));
        std::cout << "Signed in as " << state.patientEmail << ".\n";
    } else {
        std::cout << "Wrong code. Please try again from the menu.\n";
    }
}

void bookAppointment(AppState& state) {
    if (state.patientEmail.empty()) {
        std::cout << "\nPlease sign in as a patient first (option 1).\n";
        return;
    }
    std::cout << "\n--- Book an appointment at VishwaRaj Hospital ---\n";
    for (std::size_t i = 0; i < kDoctors.size(); ++i)
        std::cout << "  " << i + 1 << ". " << std::left << std::setw(22) << kDoctors[i].name
                  << std::setw(18) << kDoctors[i].specialty
                  << (kDoctors[i].available ? "Available" : "In surgery") << '\n';
    const int doctor = askNumber("Choose a doctor (1-6): ", static_cast<int>(kDoctors.size()));
    if (doctor < 0) { std::cout << "Please choose a number from the list.\n"; return; }
    const std::string name = ask("Your full name: ");
    if (name.empty()) { std::cout << "Name is required.\n"; return; }
    const std::string date = ask("Date (YYYY-MM-DD), e.g. 2026-10-05: ");
    if (!isValidDate(date)) { std::cout << "Please type the date like 2026-10-05.\n"; return; }
    for (std::size_t i = 0; i < kSlots.size(); ++i)
        std::cout << "  " << i + 1 << ". " << kSlots[i] << '\n';
    const int slot = askNumber("Choose a time (1-6): ", static_cast<int>(kSlots.size()));
    if (slot < 0) { std::cout << "Please choose a number from the list.\n"; return; }

    const std::size_t d = static_cast<std::size_t>(doctor - 1);  // menu starts at 1, lists at 0
    const std::size_t s = static_cast<std::size_t>(slot - 1);
    const int id = book(state, name, state.patientEmail, d, date, s);
    std::cout << "Booked! Appointment #" << id << " with " << kDoctors[d].name << " on " << date
              << " at " << kSlots[s] << ".\n";
}

void wardLogin(AppState& state) {
    std::cout << "\n--- Ward login (Doctor / Ward) ---\n";
    const std::string user = ask("Username: ");
    const std::string password = ask("Password: ");
    state.wardLoggedIn = verifyWard(user, password);
    if (state.wardLoggedIn) std::cout << "Welcome, " << kWardName << ".\n";
    else std::cout << "Wrong username or password.\n";
}

void wardConsole(AppState& state) {
    if (!state.wardLoggedIn) {
        std::cout << "\nPlease log in as ward first (option 3).\n";
        return;
    }
    int confirmed = 0;
    for (const Appointment& a : state.appointments)
        if (!a.cancelled) ++confirmed;
    int availableNow = 0;
    for (const Doctor& doc : kDoctors)
        if (doc.available) ++availableNow;
    std::cout << "\n--- " << kWardName << " ---\n";
    std::cout << "  Appointments: " << confirmed << "   Beds available: " << state.beds
              << "   Doctors: " << kDoctors.size() << "   Available now: " << availableNow
              << "\n\n";
    printQueue(state);
    const std::string answer =
        ask("\nType an appointment # to cancel it, or press Enter to go back: ");
    if (answer.empty()) return;
    const bool ok = isAllDigits(answer) && answer.size() < 6 && cancel(state, std::stoi(answer));
    std::cout << (ok ? "Appointment cancelled.\n" : "No confirmed appointment with that number.\n");
}

void updateBeds(AppState& state) {
    if (!state.wardLoggedIn) {
        std::cout << "\nPlease log in as ward first (option 3).\n";
        return;
    }
    std::cout << "\nBeds available now: " << state.beds << '\n';
    const std::string answer = ask("New number (Enter = keep, r = reset to 100): ");
    if (answer.empty()) return;
    if (toLower(answer) == "r") state.beds = 100;
    else setBedsFromText(state, answer);
    std::cout << "Beds available: " << state.beds << '\n';
}

void hospitalSearch() {
    std::cout << "\n--- Hospital directory ---\n";
    const std::string query = ask("Search by city, name or area (e.g. Dhule, civil, Loni): ");
    const std::vector<Hospital> found = searchHospitals(query);
    if (found.empty()) {
        std::cout << "No hospitals found.\n";
        return;
    }
    for (const Hospital& h : found)
        std::cout << "  " << h.name << "\n     " << h.area << ", " << h.city << "  |  "
                  << h.phone << "  |  " << h.verified << '\n';
}

// Runs a full scenario by itself, with no typing needed. Handy for presentations.
void automaticDemo() {
    AppState demo;
    std::cout << "\n=== Automatic demo ===\n";

    std::cout << "\n[1] A patient signs in.\n";
    const std::string email = "student@college.in";
    const std::string code = generateCode();
    std::cout << "    Email " << email << " is valid: " << (isValidEmail(email) ? "yes" : "no")
              << "\n    Code shown on screen: " << code << " -> entered correctly -> signed in\n";
    demo.patientEmail = email;

    std::cout << "\n[2] Three appointments are booked with Dr. Aditi Kulkarni (in this order).\n";
    book(demo, "Riya Patil", email, 0, "2026-10-05", 1);  // 10:30 AM
    book(demo, "Aman Shah", email, 0, "2026-10-05", 0);   // 9:00 AM
    book(demo, "Kabir Rao", email, 0, "2026-10-05", 3);   // 2:00 PM
    std::cout << "    10:30 AM, then 9:00 AM, then 2:00 PM\n";

    std::cout << "\n[3] The ward logs in.\n";
    const bool wrongAllowed = verifyWard("vishwaraj", "wrong-pass");
    const bool rightAllowed = verifyWard("vishwaraj", "vishwaraj@123");
    std::cout << "    vishwaraj / wrong-pass    -> " << (wrongAllowed ? "allowed" : "rejected")
              << "\n    vishwaraj / vishwaraj@123 -> " << (rightAllowed ? "allowed" : "rejected")
              << "  (password checked with SHA-256)\n";

    std::cout << "\n[4] Ward queue, sorted by real clock time (9:00 AM comes before 10:30 AM):\n";
    printQueue(demo);

    std::cout << "\n[5] The ward cancels appointment #3 (2:00 PM). "
                 "Cancelled bookings move to the end:\n";
    cancel(demo, 3);
    printQueue(demo);

    const int startBeds = demo.beds;
    const int typed96 = setBedsFromText(demo, "96");
    const int typedAbc = setBedsFromText(demo, "abc");
    std::cout << "\n[6] Beds: start at " << startBeds << ", ward types \"96\" -> " << typed96
              << ", types \"abc\" -> " << typedAbc << " (never negative, never text)\n";

    std::cout << "\n[7] Hospital search for \"Dhule\":\n";
    const std::vector<Hospital> dhule = searchHospitals("Dhule");
    for (const Hospital& h : dhule)
        std::cout << "    " << h.name << "  (" << h.verified << ")\n";

    std::cout << "\n=== End of automatic demo ===\n";
}

// =================================================================== main

void printMenu(const AppState& state) {
    const std::string patient =
        state.patientEmail.empty() ? std::string("not signed in") : state.patientEmail;
    std::cout << "\n==============================================\n"
              << "   MediVerse - Hospital Services (C++ demo)\n"
              << "==============================================\n"
              << "  Patient: " << patient
              << "   |   Ward: " << (state.wardLoggedIn ? "logged in" : "not logged in") << "\n\n"
              << "  1. Patient sign-in (email code)\n"
              << "  2. Book an appointment\n"
              << "  3. Ward login (Doctor / Ward)\n"
              << "  4. Ward console: queue and cancellations\n"
              << "  5. Update beds available\n"
              << "  6. Search hospitals\n"
              << "  7. Run automatic demo\n"
              << "  0. Exit\n";
}

}  // namespace

int main() {
    AppState state;
    try {
        while (true) {
            printMenu(state);
            const std::string choice = ask("Choose an option: ");
            if (choice == "0") break;
            if (choice == "1") patientSignIn(state);
            else if (choice == "2") bookAppointment(state);
            else if (choice == "3") wardLogin(state);
            else if (choice == "4") wardConsole(state);
            else if (choice == "5") updateBeds(state);
            else if (choice == "6") hospitalSearch();
            else if (choice == "7") automaticDemo();
            else std::cout << "Please type a number from the menu.\n";
        }
    } catch (const EndOfInput&) {
        std::cout << "\n(No more input.)\n";
    }
    std::cout << "Thank you for using MediVerse!\n";
    return 0;
}
