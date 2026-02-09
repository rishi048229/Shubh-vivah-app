package com.Shubhvivah.horoscope;


import java.time.LocalDate;
import lombok.Data;

@Data
public class HoroscopeDto {
    private String rashi;
    private LocalDate date;
    private String prediction;
    private String mood;
    private String luckyColor;
    private String luckyNumber;
}
