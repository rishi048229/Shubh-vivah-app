package com.example.shubhvivah.profile.enums;

public enum AnnualIncome {

    BELOW_2_LAKH("Below 2 Lakh"),
    BETWEEN_2_TO_5_LAKH("2 – 5 Lakh"),
    BETWEEN_5_TO_10_LAKH("5 – 10 Lakh"),
    BETWEEN_10_TO_20_LAKH("10 – 20 Lakh"),
    BETWEEN_20_TO_50_LAKH("20 – 50 Lakh"),
    ABOVE_50_LAKH("Above 50 Lakh");

    private final String label;

    AnnualIncome(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
