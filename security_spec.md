# Security Specification & Test-Driven Security (TDD)
## OOU StudentCircle — Real-Time Messaging & Notification Security Architecture

### Phase 0: Security Invariants & Threat Modeling

#### 1. Data Invariants
- **INV-MSG-1 (Participant Isolation)**: A conversation document (`/conversations/{conversationId}`) and its subcollection messages (`/conversations/{conversationId}/messages/{messageId}`) can ONLY be read by authenticated users whose UID exists in `resource.data.participants` or by authorized platform admins.
- **INV-MSG-2 (Sender Authenticity)**: When creating a message, `request.resource.data.senderId` MUST match `request.auth.uid`, and `request.auth.uid` MUST exist in the parent conversation's `participants` array.
- **INV-MSG-3 (Conversation Creation Safeguard)**: When initiating a conversation, the creator's UID (`request.auth.uid`) MUST be present in `request.resource.data.participants`, and the participants array size MUST be between 2 and 10 members.
- **INV-MSG-4 (Notification Confidentiality)**: Notifications (`/notifications/{notificationId}`) can ONLY be read, updated (e.g. marked as read), or deleted by the user whose UID matches `resource.data.userId`.
- **INV-MSG-5 (Notification Integrity)**: Authenticated users can create notifications targeted to legitimate recipients with verified payload constraints (e.g. valid notification type, valid string lengths).
- **INV-MSG-6 (Zero-Tolerance Demo Data Leakage)**: Production database queries MUST filter strictly by authenticated UID; all demo/mock data arrays must be completely purged from live runtime storage.

---

### Phase 0: The "Dirty Dozen" Malicious Security Test Payloads

1. **Payload 01: Snoop Eavesdropping (Non-Participant Read Attempt)**
   - *Target*: `GET /conversations/conv-123/messages/msg-999`
   - *Actor*: `attacker_uid` (not in `participants: ['student-1', 'student-2']`)
   - *Expected Result*: **PERMISSION_DENIED** (403).

2. **Payload 02: Impersonated Sender (Forged senderId)**
   - *Target*: `CREATE /conversations/conv-123/messages/msg-forged`
   - *Actor*: `student-1`
   - *Payload*: `{ conversationId: "conv-123", senderId: "student-2", text: "I agree to refund 100k" }`
   - *Expected Result*: **PERMISSION_DENIED** (senderId mismatch).

3. **Payload 03: Hijacked Conversation Create (Attacker not in participants)**
   - *Target*: `CREATE /conversations/conv-rogue`
   - *Actor*: `attacker_uid`
   - *Payload*: `{ participants: ["victim-1", "victim-2"], title: "Wire Fraud" }`
   - *Expected Result*: **PERMISSION_DENIED** (auth.uid not in participants).

4. **Payload 04: Notification Eavesdropping**
   - *Target*: `GET /notifications/notif-victim-secret`
   - *Actor*: `attacker_uid`
   - *Doc State*: `{ userId: "victim-1", message: "Your OTP is 94821" }`
   - *Expected Result*: **PERMISSION_DENIED**.

5. **Payload 05: Unauthorized Notification Tampering / Deletion**
   - *Target*: `DELETE /notifications/notif-victim-secret`
   - *Actor*: `attacker_uid` (not matching `userId`)
   - *Expected Result*: **PERMISSION_DENIED**.

6. **Payload 06: Cross-Tenant Message Injection into Other People's Threads**
   - *Target*: `CREATE /conversations/conv-private-deal/messages/msg-hack`
   - *Actor*: `unrelated_user`
   - *Payload*: `{ senderId: "unrelated_user", text: "Fake escrow confirmation" }`
   - *Expected Result*: **PERMISSION_DENIED** (user not in conversation participants).

7. **Payload 07: Unauthenticated Read / Write to Messages**
   - *Target*: `GET /conversations/conv-123`
   - *Actor*: Unauthenticated (`request.auth == null`)
   - *Expected Result*: **PERMISSION_DENIED**.

8. **Payload 08: Oversized Payload Denial of Service**
   - *Target*: `CREATE /conversations/conv-123/messages/msg-bomb`
   - *Actor*: `student-1`
   - *Payload*: `{ senderId: "student-1", text: "A".repeat(50000) }`
   - *Expected Result*: **PERMISSION_DENIED** (exceeds text size limit).

9. **Payload 09: Forged Status / Read Receipts of Counterparty**
   - *Target*: `UPDATE /notifications/notif-victim`
   - *Actor*: `attacker_uid` attempting to modify someone else's notification read state
   - *Expected Result*: **PERMISSION_DENIED**.

10. **Payload 10: Participant Escalation / Self-Addition**
    - *Target*: `UPDATE /conversations/conv-exclusive`
    - *Actor*: `eavesdropper_uid` attempting to patch `participants` array
    - *Expected Result*: **PERMISSION_DENIED**.

11. **Payload 11: Spoofed Admin Privileges in Client Claims**
    - *Target*: `GET /adminLogs/log-1`
    - *Actor*: Standard student claiming `{ role: "admin" }` in document body without verified admin doc or token
    - *Expected Result*: **PERMISSION_DENIED**.

12. **Payload 12: Blank or Corrupted Conversation Schema Injection**
    - *Target*: `CREATE /conversations/conv-corrupt`
    - *Actor*: `student-1`
    - *Payload*: `{ participants: "not-an-array", lastMessage: null }`
    - *Expected Result*: **PERMISSION_DENIED** (violates data type validation).
