package com.example.shubhvivah.profile.enums;

import lombok.Getter;

@Getter
public enum OccupationType {

    GOVERNMENT_SERVICE("Government Service"),
    PRIVATE_SECTOR("Private Sector"),
    CIVIL_SERVICE("Civil Service"),
    BUSINESS("Business"),
    DEFENSE("Defense"),
    RETIRED("Retired"),
    FARMER("Farmer"),
    NOT_WORKING("Not Working"),
    OTHER("Other");

    private final String label;

    OccupationType(String label) {
        this.label = label;
    }

}
