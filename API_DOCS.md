# API Documentation

## Products

### Get All Products
- **GET** `/api/v1/products`
- **Description:** Returns all products with reviews, discount, size guide, and variants.
- **Sample Response:**
```json
[
  {
    "id": "...",
    "name": "...",
    ...,
    "reviews": [],
    "discount": null,
    "sizeGuide": null,
    "variants": []
  }
]
```

### Get Product by ID
- **GET** `/api/v1/products/:id`
- **Description:** Returns a single product with all related data.

### Create Product
- **POST** `/api/v1/products`
- **Body:**
```json
{
  "name": "Classic Blue Denim Jacket",
  "description": "A timeless blue denim jacket for all seasons.",
  "category_id": "...",
  "brand_id": "...",
  "base_price": 59.99,
  "discount": 10.00,
  "final_price": 49.99,
  "material": "Denim",
  "target": "UNISEX",
  "tags": ["denim", "jacket", "blue", "casual"],
  "stock": 100,
  "images": ["url1", "url2"],
  "is_featured": true,
  "is_new_arrival": true,
  "created_by": "user-id"
}
```

### Update Product
- **PUT** `/api/v1/products/:id`
- **Body:** (fields to update)

### Delete Product
- **DELETE** `/api/v1/products/:id`

---

## Reviews

### Get Reviews for a Product
- **GET** `/api/v1/reviews/:productId`
- **Description:** Returns all reviews for a product.

### Get Review by ID
- **GET** `/api/v1/reviews/:id`

### Create Review for a Product
- **POST** `/api/v1/reviews/:productId`
- **Body:**
```json
{
  "user_id": "...",
  "rating": 5,
  "comment": "Great product!"
}
```

### Update Review
- **PUT** `/api/v1/reviews/:id`
- **Body:** (fields to update)

### Delete Review
- **DELETE** `/api/v1/reviews/:id`

---

## Size Guide

### Get Size Guide by Product ID
- **GET** `/api/v1/products/:productId/size-guide`

### Get Size Guide by ID
- **GET** `/api/v1/size-guides/:id`

### Create Size Guide for a Product
- **POST** `/api/v1/products/:productId/size-guide`
- **Body:**
```json
{
  "size_data": {
    "S": { "chest": "34in", "waist": "28in" },
    "M": { "chest": "38in", "waist": "32in" }
  }
}
```

### Update Size Guide
- **PUT** `/api/v1/size-guides/:id`
- **Body:** (fields to update)

### Delete Size Guide
- **DELETE** `/api/v1/size-guides/:id`

---

## Discount (Flash Sale)

### Get Discount for a Product
- **GET** `/api/v1/discounts/:productId`

### Get Discount by ID
- **GET** `/api/v1/discounts/id/:id`

### Create Discount for a Product
- **POST** `/api/v1/discounts/:productId`
- **Body:**
```json
{
  "discount_percentage": 20,
  "start_time": "2024-06-01T00:00:00Z",
  "end_time": "2024-06-10T00:00:00Z",
  "categoryId": "..." // optional
}
```

### Update Discount
- **PUT** `/api/v1/discounts/:id`
- **Body:** (fields to update)

### Delete Discount
- **DELETE** `/api/v1/discounts/:id`

---

## Category

### Get All Categories
- **GET** `/api/v1/categories`

### Get Category by ID
- **GET** `/api/v1/categories/:id`

### Create Category
- **POST** `/api/v1/categories`
- **Body:**
```json
{
  "name": "Jackets",
  "description": "All types of jackets including denim, leather, and bomber.",
  "image_url": "url"
}
```

### Update Category
- **PUT** `/api/v1/categories/:id`
- **Body:** (fields to update)

### Delete Category
- **DELETE** `/api/v1/categories/:id`

---

## Brand

### Get All Brands
- **GET** `/api/v1/brands`

### Get Brand by ID
- **GET** `/api/v1/brands/:id`

### Create Brand
- **POST** `/api/v1/brands`
- **Body:**
```json
{
  "name": "Urban Style",
  "description": "Trendy and modern fashion brand for urban youth.",
  "image_url": "url"
}
```

### Update Brand
- **PUT** `/api/v1/brands/:id`
- **Body:** (fields to update)

### Delete Brand
- **DELETE** `/api/v1/brands/:id` 