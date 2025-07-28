# ♟️ ChessGlance

**ChessGlance** — a web application that displays a list of grandmasters from Chess.com.  
You can click on any player and navigate to their individual profile page, where a timer shows how much time has passed since their last activity. The timer updates in real-time ⏱

---

## 🎯 Project Goal

This project was created as a quick experiment:
- test the capabilities of **artificial intelligence** in the role of a developer
- check how quickly you can build a working, stylish and useful product
- learn to use AI tools like Cursor and ChatGPT in real development

---

## 🛠️ Technologies Used

### 🧠 Tools

| Tool           | Purpose                                    |
|----------------|--------------------------------------------|
| **Cursor**     | AI interface for code generation and editing |
| **ChatGPT**    | Architecture, component generation, structure help |
| **Vercel**     | Hosting and CI/CD for Next.js applications |
| **GitHub**     | Repository and development history         |

---

### ⚛️ Framework and Language

| Technology     | Purpose                            |
|----------------|------------------------------------|
| **Next.js 15+** | Main framework (App Router)        |
| **React**      | UI library                         |
| **TypeScript** | Typing                             |

---

### 🎨 Styling

| Technology     | Purpose                            |
|----------------|------------------------------------|
| **TailwindCSS** | Utility CSS framework             |
| **PostCSS**    | Style preprocessing under the hood |

> Thanks to TailwindCSS, the project scales easily, and if desired, you can configure a **custom theme**: colors, fonts, spacing — everything is set through `tailwind.config.ts`.

---

## 📡 API

📍 Uses open public APIs from [Chess.com](https://www.chess.com/news/view/published-data-api):

- `GET https://api.chess.com/pub/titled/GM`  
  Returns a list of all users with Grandmaster title

- `GET https://api.chess.com/pub/player/{username}`  
  Returns player profile: name, country, avatar, registration, last online

---

## 🧪 How to Run Locally

```bash
git clone git@github.com:Victorio47/chess-glance.git
cd chess-glance
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Demo

**Live application:** [https://chess-glance-7o3p.vercel.app/](https://chess-glance-7o3p.vercel.app/)

---

## 🎨 Features

### 🌙 Dark Theme Support
- Automatic switching based on system settings
- Contrast colors for better readability
- Responsive design for all devices

### ⚡ Performance
- Server-Side Rendering (SSR) for fast loading
- Optimized images and components
- Minimal bundle size

### 🔄 Real-time
- Activity timer updates every second
- Automatic player status updates
- Smooth animations and transitions

---

## 📁 Project Structure

```
chess-glance/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── page.tsx           # Main page
│   │   ├── players/           # Players list
│   │   └── profile/[username]/ # Player profile
│   ├── features/              # Functional modules
│   │   ├── players/           # Players list logic
│   │   └── profile/           # Profile logic
│   └── shared/                # Shared components
├── public/                    # Static files
└── package.json
```

---

## 🚀 Deployment

The project automatically deploys to Vercel when pushing to the main branch:

1. Fork the repository
2. Connect to Vercel
3. Configure environment variables (if needed)
4. Done! 🎉

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch for a new feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project was created for educational purposes. Use freely!

---

## 🙏 Acknowledgments

- [Chess.com](https://www.chess.com/) for the open API
- [Vercel](https://vercel.com/) for the excellent deployment platform
- [TailwindCSS](https://tailwindcss.com/) for the wonderful CSS framework
- AI tools for development assistance 🤖

---

*Created with AI as an experiment in rapid development* 🚀
