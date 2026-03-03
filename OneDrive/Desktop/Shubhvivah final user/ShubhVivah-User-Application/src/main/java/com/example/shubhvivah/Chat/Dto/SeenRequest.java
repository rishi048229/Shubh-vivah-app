package com.example.shubhvivah.Chat.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeenRequest {

    private Long messageId;
    private Long userId;
}
