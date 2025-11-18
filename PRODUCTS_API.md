# Products API Documentation

This guide covers the MySQL products table and API endpoints for managing financial products in the Mwamunda application.

## Products Database Table

The products table stores information about financial products and services.

### Table Structure

| Column       | Type            | Notes                                    |
| ------------ | --------------- | ---------------------------------------- |
| id           | INT AUTO_INC    | Primary key                              |
| name         | VARCHAR(255)    | Product name (required)                  |
| description  | TEXT            | Detailed product description             |
| category     | VARCHAR(100)    | Product category (e.g., Loans, Training) |
| price        | DECIMAL(12, 2)  | Product price in KES                     |
| features     | TEXT            | Product features (comma-separated)       |
| image_url    | VARCHAR(500)    | URL to product image                     |
| status       | VARCHAR(50)     | active, inactive, or draft               |
| created_at   | TIMESTAMP       | Auto-generated creation timestamp        |
| updated_at   | TIMESTAMP       | Auto-updated modification timestamp      |

## API Endpoints

### 1. Initialize Products Table

Create the products table in the database.

```http
POST /api.php
Content-Type: application/json

{
  "action": "init_products_table"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Products table created successfully"
}
```

### 2. Get All Products

Fetch all products from the database.

```http
GET /api.php?table=products
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Fair Personal Loans",
    "description": "Affordable personal loans for individuals",
    "category": "Loans",
    "price": 5000,
    "features": "Quick approval, Flexible terms, Low interest rates",
    "image_url": "https://example.com/image.jpg",
    "status": "active",
    "created_at": "2024-01-15 10:30:00",
    "updated_at": "2024-01-15 10:30:00"
  }
]
```

### 3. Get Recent Products

Fetch the most recently created products with a limit.

```http
GET /api.php?table=products&orderBy=created_at&order=DESC&limit=5
```

**Query Parameters:**

- `orderBy` - Column to order by (default: id)
- `order` - ASC or DESC (default: DESC)
- `limit` - Maximum number of results to return

**Response:** Same as Get All Products

### 4. Get Single Product

Fetch a specific product by ID.

```http
GET /api.php?table=products&id=1
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "Fair Personal Loans",
    ...
  }
]
```

### 5. Create Product

Add a new product to the database.

```http
POST /api.php
Content-Type: application/json

{
  "table": "products",
  "data": {
    "name": "Fair Personal Loans",
    "description": "Affordable personal loans for individuals",
    "category": "Loans",
    "price": 5000,
    "features": "Quick approval, Flexible terms, Low interest rates",
    "image_url": "https://example.com/image.jpg",
    "status": "active"
  }
}
```

**Response:**

```json
{
  "success": true,
  "id": 1
}
```

### 6. Update Product

Update an existing product.

```http
PUT /api.php
Content-Type: application/json

{
  "table": "products",
  "id": 1,
  "data": {
    "name": "Fair Personal Loans Updated",
    "price": 6000
  }
}
```

**Response:**

```json
{
  "success": true
}
```

### 7. Delete Product

Delete a product by ID.

```http
DELETE /api.php?table=products&id=1
```

**Response:**

```json
{
  "success": true
}
```

## Frontend Usage

### React Hooks & Components

#### useRecentProducts Hook

Get the 5 most recent products:

```typescript
import { getRecentProducts } from "@/lib/products";

const products = await getRecentProducts(5);
```

#### RecentProducts Component

Display recent products in a component:

```tsx
import RecentProducts from "@/components/RecentProducts";

export default function MyPage() {
  return (
    <RecentProducts limit={10} className="my-8" />
  );
}
```

#### Products Library Functions

```typescript
import {
  getProducts,
  getRecentProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  initProductsTable,
} from "@/lib/products";

// Initialize table
await initProductsTable();

// Get all products
const allProducts = await getProducts();

// Get recent products
const recent = await getRecentProducts(5);

// Get single product
const product = await getProductById(1);

// Create product
const result = await createProduct({
  name: "New Product",
  description: "Product description",
  price: 5000,
  status: "active",
});

// Update product
await updateProduct(1, {
  price: 6000,
  status: "inactive",
});

// Delete product
await deleteProduct(1);
```

## Admin Interface

### Admin Products Page

Access the admin products management page at `/admin/products`

Features:

- View all products in a table
- Create new products
- Edit existing products
- Delete products
- Filter by status
- Search by name

## Best Practices

1. **Always initialize the table** before using:
   ```typescript
   await initProductsTable();
   ```

2. **Validate product data** before submission:
   - Name is required
   - Price should be >= 0
   - Status should be one of: active, inactive, draft

3. **Handle errors gracefully**:
   ```typescript
   try {
     const products = await getRecentProducts(5);
   } catch (error) {
     console.error("Failed to fetch products:", error);
     // Show error to user
   }
   ```

4. **Cache products** in React state or query client to reduce API calls

5. **Use pagination** for large datasets:
   ```http
   GET /api.php?table=products&limit=10&offset=0
   ```

## Sample Products

Here are some sample products to populate the database:

```json
[
  {
    "name": "Fair Personal Loans",
    "category": "Loans",
    "price": 5000,
    "description": "Affordable personal loans with flexible repayment terms",
    "features": "Quick approval,Low interest rates,Flexible terms",
    "status": "active"
  },
  {
    "name": "Chama Loans",
    "category": "Group Loans",
    "price": 10000,
    "description": "Specialized loans for chama and group savings",
    "features": "Group benefits,Flexible amounts,Quick disbursement",
    "status": "active"
  },
  {
    "name": "Debt Advice Services",
    "category": "Financial Advisory",
    "price": 2000,
    "description": "Professional debt management and advisory services",
    "features": "Expert consultation,Debt restructuring,Payment planning",
    "status": "active"
  },
  {
    "name": "Financial Capability Training",
    "category": "Training",
    "price": 1500,
    "description": "Comprehensive financial literacy and management training",
    "features": "Budgeting skills,Saving strategies,Financial planning",
    "status": "active"
  }
]
```

## Troubleshooting

### "Table name is required"

- Ensure `table` parameter is set to "products"
- Check request format

### "Failed to fetch products"

- Verify the products table exists (run init_products_table action)
- Check database connection
- Ensure PHP API is accessible

### Products not updating

- Verify product ID is correct
- Check data format in PUT request
- Ensure required fields are included

### CORS errors

- Check that API URL is correctly configured
- Verify `api.php` has CORS headers enabled
- For production, configure CORS properly

## Security Considerations

1. **Input Validation**: All product data is validated before insertion
2. **SQL Injection Prevention**: Using prepared statements
3. **CORS**: Configure properly for production domain
4. **Admin Access**: Only admins can create/edit/delete products
5. **Data Types**: Fields use appropriate MySQL data types

## Next Steps

1. Initialize the products table
2. Add sample products via admin interface
3. Display recent products on home page
4. Integrate with product pages
5. Add product filters and search
