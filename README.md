# 🛍️ Ecommerce Product Recommender

An internship assignment project built using the **MERN Stack** (MongoDB, Express, React, Node.js).  
The project implements **Product Management (CRUD with image uploads)**, a **Rule-based Recommendation System**, and extra features like **Wishlist, Recently Viewed, Filters, Search, color picker and Flash Sale Countdown**.  

---

## 🚀 Features

### 🔹 Core Requirements
- **Product CRUD (with Images)**  
  - Add, update, delete, and view products.  
  - Image uploads handled via **Multer** with validation & size limits.  
  - Old images are automatically cleaned up when replaced or deleted.  
  - Each product has:  
    - `name`  
    - `price` (auto-normalized & rounded)  
    - `category`  
    - `tags` (array)  
    - `colors` (array)  
    - `sizes` (array)  
    - `description`  
    - `image` (URL)  

- **Rule-based Recommendations**  
  - When viewing a product, show up to 5 similar products.  
  - Recommendation logic:
    - Shared tags  
    - Same category  
    - Similar price range (smallest difference first)  

### 🔹 Extra Features
- ✅ Wishlist system (localStorage + API-ready endpoints)  
- ✅ Recently viewed products (localStorage-based)  
- ✅ Flash sale countdown timer (based on `saleEndTime`)  
- ✅ Filters:
  - Price range slider  
  - Category/tags filter  
  - Size filter  
- ✅ Search bar (by name/keyword)  
- ✅ SweetAlert2 for confirmation dialogs  

---

## 🏗️ Tech Stack

- **Frontend**: React, CSS, React Router, SweetAlert2  
- **Backend**: Node.js, Express.js, Mongoose (MongoDB), Multer  
- **Database**: MongoDB Atlas / Local MongoDB  
- **Other Tools**: dotenv, cors, axios  

---

## 📂 Folder Structure

```

mern-product-recommender/
│
├── backend/
│   ├── models/         # Mongoose schemas (Product.js, Wishlist.js)
│   ├── routes/         # Express routes (productRoutes.js, wishlistRoutes.js)
│   ├── uploads/        # Uploaded product images
│   ├── server.js       # Express app entry
│   └── .env            # Environment variables
│
├── frontend/
│   ├── src/
|   ├── ├── assest/     # image
│   │   ├── components/ # UI components (cards, filters, navbar, etc.)
│   │   ├── pages/      # React pages (ProductManagement, ProductView, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env            # API base URL
│
└── README.md

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/RashmikaAkash/ecommerce-product-recommender.git
cd ecommerce-product-recommender
````

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `/backend`:

```env
MONGO_URI=mongodb+srv://livezen:livezen01@productdb.umbfkpx.mongodb.net/productdb?retryWrites=true&w=majority&appName=productdb
PORT=5000
CORS_ORIGIN=*
```

Run backend:

```bash
npm run dev
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm start
```

---

## 📡 API Endpoints

### Products

* `POST /api/products` → Add new product (JSON)
* `GET /api/products` → Get all products (supports pagination)
* `GET /api/products/:id` → Get single product
* `PUT /api/products/:id` → Update product (supports `multipart/form-data` with image upload)
* `DELETE /api/products/:id` → Delete product (cleans up old image if present)
* `GET /api/products/:id/recommendations` → Get recommended products

### Wishlist (optional extension)

* `POST /api/wishlist/:productId` → Add product to wishlist
* `GET /api/wishlist` → Get wishlist
* `DELETE /api/wishlist/:productId` → Remove product from wishlist

---

## 🎨 Design Decisions

* **Rule-based recommendation** chosen for simplicity & speed.
* Used **Multer** for image uploads with 5MB max size & file type filter.
* Implemented **price normalization** to handle various number formats (commas, dots, etc.).
* Array fields (`tags`, `colors`, `sizes`) accept JSON strings, comma-separated values, or arrays.
* Used **localStorage** for Wishlist & Recently Viewed to save time (API routes exist for extension).

---

## 🚧 Challenges & Improvements

* Fixed MongoDB warnings with `mongoose.set("strictQuery", true)`.
* Image file cleanup added to prevent storage bloat.
* Flash sale countdown is static; could be tied to promotions in DB.
* Could add:

  * User authentication (JWT)
  * Ratings & reviews
  * AI-based recommendations (cosine similarity / embeddings)

---

## 📖 References

* [MongoDB Docs](https://www.mongodb.com/docs/)
* [Express.js Docs](https://expressjs.com/)
* [React Router Docs](https://reactrouter.com/)
* [SweetAlert2](https://sweetalert2.github.io/)
* [Multer](https://github.com/expressjs/multer)

---

## 📌 Submission

* **GitHub Repo Link**: *https://github.com/RashmikaAkash/ecommerce-product-recommender.git*

---

✨ *This project was built as part of an Internship Assignment to demonstrate MERN skills, CRUD operations, file uploads, and recommendation logic.*


