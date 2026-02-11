package com.Shubhvivah.matchmaking;


import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "user_relations")
public class UserRelation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long fromUserId;
    private Long toUserId;

    @Enumerated(EnumType.STRING)
    private RelationType type;

    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(length = 500)
private String reportReason;

public static UserRelation of(Long from, Long to, RelationType type) {
    UserRelation r = new UserRelation();
    r.setFromUserId(from);
    r.setToUserId(to);
    r.setType(type);
    return r;
}


}