# Size Guide Module API Documentation

## Base URL
`/api/size-guide`

## Endpoints

| Name         | Method | Endpoint         | Description           |
|--------------|--------|------------------|-----------------------|
| List         | GET    | /                | List all size guides  |
| Create       | POST   | /                | Create a size guide   |
| Update       | PUT    | /:id             | Update a size guide   |
| Delete       | DELETE | /:id             | Delete a size guide   |

## Example Requests

### Create
```json
{
  "name": "Men's Shirts",
  "sizes": ["S", "M", "L", "XL"]
}
```

## Example Responses

### List
```json
[
  { "id": 1, "name": "Men's Shirts", "sizes": ["S", "M", "L", "XL"] }
]
```

---
[Back to main API documentation](../../README.md) 