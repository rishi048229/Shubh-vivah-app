package com.Shubhvivah.chat;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TypingRequest {

    private Long from;
    private Long to;
    private boolean typing;
}
