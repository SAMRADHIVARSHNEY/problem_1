#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <algorithm>
#include <cctype>
#include <cmath>

#include "json.hpp"   // make sure json.hpp is in the same folder

using namespace std;
using json = nlohmann::json;

// Decode y value from given base (2..16)
long long decodeValue(int base, const string &s) {
    long long val = 0;
    for (char c : s) {
        int d;
        if (isdigit(c)) d = c - '0';
        else if (isalpha(c)) d = 10 + (tolower(c) - 'a');
        else continue;
        val = val * base + d;
    }
    return val;
}

// Lagrange interpolation at x=0
long long lagrange(vector<pair<long long,long long>> pts, int k) {
    long double result = 0.0;
    for (int i = 0; i < k; i++) {
        long double xi = pts[i].first;
        long double yi = pts[i].second;
        long double term = yi;
        for (int j = 0; j < k; j++) {
            if (i == j) continue;
            long double xj = pts[j].first;
            term *= (-xj) / (xi - xj);
        }
        result += term;
    }
    return llround(result); // nearest integer
}

int main() {
    string filename;
    cout << "Enter testcase file name (e.g., testcase1.json): ";
    cin >> filename;

    ifstream fin(filename);
    if (!fin) {
        cout << "File not found!\n";
        return 0;
    }

    json j; fin >> j;

    int k = j["keys"]["k"];
    vector<pair<long long,long long>> pts;

    for (auto& el : j.items()) {
        if (el.key() == "keys") continue;
        long long x = stoll(el.key());
        int base = stoi(el.value()["base"].get<string>());
        string valStr = el.value()["value"].get<string>();
        long long y = decodeValue(base, valStr);
        pts.push_back({x,y});
    }

    sort(pts.begin(), pts.end());

    cout << "Using first " << k << " points:\n";
    for (int i=0; i<k; i++) {
        cout << "(" << pts[i].first << "," << pts[i].second << ")\n";
    }

    long long c = lagrange(pts, k);
    cout << "Secret (c) = " << c << "\n";
}
