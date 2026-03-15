# X Clone

A modern **X (Twitter) clone** built with the latest **Next.js 16, React 19, Prisma, and Better Auth**.
This project demonstrates a scalable architecture for building a **real-time social media platform** with modern full-stack technologies.

---

## 🚀 Features

- 🔐 Authentication with **Better Auth**
- 👤 User profiles
- 🐦 Tweet posting
- 💬 Nested tweet replies (tree structure)
- ❤️ Like system
- 🖼 Image uploads via **Cloudinary**
- 🌙 Dark / Light mode support
- ⚡ Server components & modern Next.js architecture
- 📱 Responsive UI with **TailwindCSS + Radix UI**

---

## 🛠 Tech Stack

### Frontend

- **React 19**
- **Next.js 16 (App Router)**
- **TailwindCSS v4**
- **Radix UI**
- **Shadcn UI**
- **Lucide Icons**

### Backend

- **Next.js Server Actions**
- **Better Auth**
- **Prisma ORM**
- **PostgreSQL**

### File Upload

- **Cloudinary**
- **next-cloudinary**

### Forms & Validation

- **React Hook Form**

### Utilities

- **clsx**
- **tailwind-merge**
- **class-variance-authority**

---

## 📂 Project Structure

Example structure:

```ts
x_clone
│
├── app
│   ├── api
│   ├── (auth)
│   ├── (main)
│   └── layout.tsx
│
├── components
│   ├── ui
│   ├── tweet
│   └── layout
│
├── lib
│   ├── auth
│   ├── prisma
│   └── utils
│
├── prisma
│   └── schema.prisma
│
├── public
│
├── types
│
└── README.md
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/x_clone.git
```

Move into the project directory:

```bash
cd x_clone
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory.

Example:

```ts
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/x_clone"

BETTER_AUTH_SECRET=your_secret

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🗄 Database Setup

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

---

## 🧑‍💻 Development

Start the development server:

```bash
npm run dev
```

Open:

```ts
http://localhost:3000
```

---

## 📜 Available Scripts

| Script          | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build production app     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

---

## 🧠 Key Concepts Implemented

## Nested Reply System

Replies are stored in a **flat database structure** and converted to a **tree structure** using a custom algorithm.

Example:

```ts
Tweet
 ├─ Reply 1
 │   ├─ Reply 1.1
 │   └─ Reply 1.2
 └─ Reply 2
```

---

## 🎨 UI System

This project uses:

- **Shadcn UI**
- **Radix UI primitives**
- **TailwindCSS**
- **Custom reusable components**

---

## 📸 Media Upload

Images are uploaded using **Cloudinary** via:

```ts
next - cloudinary;
```

This enables:

- automatic optimization
- CDN delivery
- responsive images

---

## 🌙 Theme Support

Implemented with:

```ts
next - themes;
```

Features:

- Light mode
- Dark mode
- System preference detection

---

## 🔒 Authentication

Authentication is handled by:

```ts
better - auth;
```

With:

- OAuth providers
- Session management
- Secure cookie handling
- Prisma adapter

---

## 📈 Future Improvements

- Notifications system
- Infinite scrolling
- Follow system

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to the branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.
