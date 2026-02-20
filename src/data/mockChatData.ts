export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  isOnline: boolean;
  matchPercentage: number;
}

export interface ChatConversation {
  id: string;
  user: ChatUser;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isPriority: boolean; // High match % + mutual interest
  tags: ("New" | "Mutual Interest" | "Verified")[];
}

export const MOCK_CHATS: ChatConversation[] = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "Ananya S.",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isVerified: true,
      isOnline: true,
      matchPercentage: 96,
    },
    lastMessage: "I really loved reading about your travel stories!",
    timestamp: "2m ago",
    unreadCount: 2,
    isPriority: true,
    tags: ["Mutual Interest", "Verified"],
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Priya M.",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isVerified: true,
      isOnline: false,
      matchPercentage: 92,
    },
    lastMessage: "Are you free this weekend for a coffee?",
    timestamp: "1h ago",
    unreadCount: 1,
    isPriority: true,
    tags: ["Mutual Interest", "Verified"],
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Sneha K.",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isVerified: false,
      isOnline: true,
      matchPercentage: 85,
    },
    lastMessage: "That sounds like a great plan.",
    timestamp: "3h ago",
    unreadCount: 0,
    isPriority: false,
    tags: ["New"],
  },
  {
    id: "4",
    user: {
      id: "u4",
      name: "Riya J.",
      avatar:
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isVerified: true,
      isOnline: false,
      matchPercentage: 78,
    },
    lastMessage: "Hi Rahul! Thanks for connecting.",
    timestamp: "1d ago",
    unreadCount: 0,
    isPriority: false,
    tags: ["Verified", "New"],
  },
  {
    id: "5",
    user: {
      id: "u5",
      name: "Meera P.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      isVerified: false,
      isOnline: false,
      matchPercentage: 70,
    },
    lastMessage: "Looking forward to it.",
    timestamp: "2d ago",
    unreadCount: 0,
    isPriority: false,
    tags: [],
  },
];
