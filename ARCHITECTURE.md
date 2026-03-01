# InnerLoop — Firestore Schema (ARCHITECTURE.md)

## Overview
InnerLoop uses **Firebase Auth** for authentication and **Cloud Firestore** for all data. This document maps the original PostgreSQL schema to Firestore collections.

---

## Collections

### `users` (doc ID = Firebase Auth UID)
| Field | Type | Notes |
|---|---|---|
| `name` | string | Required |
| `role` | string | `"Looper"` or `"Inner"` (maps to old `Individual` / org) |
| `tags` | array\<string\> | Hashtags/interests (denormalized from tags table) |
| `isVerified` | boolean | Default `false`. Inners get verified by admin |
| `location` | geopoint | Firebase GeoPoint (lat, lng) |
| `ageVerification` | boolean | Default `false` |
| `starRating` | number | 1–5, null until first review |
| `verifiedHours` | number | Default `0` |
| `loopCredits` | number | Default `0` |
| `createdAt` | timestamp | |

### `posts` (auto-generated doc ID)
| Field | Type | Notes |
|---|---|---|
| `authorID` | string | References `users` doc ID |
| `authorName` | string | Denormalized for feed display |
| `authorRole` | string | `"Looper"` or `"Inner"` |
| `content` | string | Post body text |
| `tags` | array\<string\> | Hashtags |
| `location` | geopoint | Where the task/post is located |
| `postTime` | timestamp | |
| `isInnerOnly` | boolean | If `true`, only visible in the Inner Loop private feed |
| `taskCapacity` | number \| null | Max volunteers (null = not a task) |
| `taskFilled` | number | Current count of accepted volunteers |
| `waitlist` | array\<string\> | User IDs on the waitlist |

### `reviews` (auto-generated doc ID)
| Field | Type | Notes |
|---|---|---|
| `reviewerID` | string | References `users` |
| `reviewedID` | string | References `users` |
| `rating` | number | 1–5 |
| `hoursVerified` | number | Must be > 0 |
| `comment` | string \| null | |
| `wasWaitlisted` | boolean | If `true`, hours & credits are doubled |
| `createdAt` | timestamp | |

---

## Key Design Decisions
1. **Denormalization**: `authorName` and `authorRole` are stored on posts to avoid extra reads on the feed.
2. **Tags as arrays**: Instead of a separate `tags` table + join, tags are stored as string arrays directly on users and posts (Firestore supports `array-contains` queries).
3. **Waitlist on post**: Stored as an array of user IDs on the post doc itself for atomic updates.
4. **Inner Loop filter**: `isInnerOnly: true` posts are filtered client-side for verified Inners; Firestore security rules enforce this server-side.
5. **GeoPoint**: Native Firestore type enables future geo-queries.

---

## `conversations` (Inner Loop DMs)
Only verified Inners can create and participate in conversations.

| Field | Type | Description |
|---|---|---|
| `participants` | `array<string>` | Two user IDs (both verified Inners) |
| `participantNames` | `map` | `{ uid: "Name" }` — denormalized for display |
| `lastMessage` | `string` | Preview text of most recent message |
| `lastMessageAt` | `timestamp` | For sorting conversation list |
| `lastSenderID` | `string` | Who sent the last message |
| `unread_{uid}` | `number` | Unread count per participant |
| `createdAt` | `timestamp` | When conversation was created |

### `conversations/{id}/messages` (subcollection)
| Field | Type | Description |
|---|---|---|
| `senderID` | `string` | UID of sender |
| `senderName` | `string` | Denormalized sender name |
| `text` | `string` | Message content |
| `sentAt` | `timestamp` | When message was sent |
