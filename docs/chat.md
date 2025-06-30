# Chat Module API Documentation

## Base URL
`/api/chat`

## Endpoints

| Name         | Method | Endpoint         | Description           |
|--------------|--------|------------------|-----------------------|
| List         | GET    | /                | List all chats        |
| Send         | POST   | /send            | Send a message        |
| History      | GET    | /history/:id     | Get chat history      |

## Example Requests

### Send
```json
{
  "senderId": 1,
  "receiverId": 2,
  "message": "Hello!"
}
```

## Example Responses

### List
```json
[
  { "id": 1, "senderId": 1, "receiverId": 2, "message": "Hello!" }
]
```

---
[Back to main API documentation](../../README.md) 