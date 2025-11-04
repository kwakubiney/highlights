# iBooks Highlights

A beautiful web app to browse and search your Apple Books highlights with filtering, pagination, and GitHub Pages deployment.

## Features

- 📚 Browse highlights from all your iBooks
- 🔍 Search through highlights and notes
- 🏷️ Filter by book
- 📄 Pagination for browsing large collections
- 🎨 Clean, modern UI with color-coded highlights
- 💭 View personal notes attached to highlights

## Project Structure

```
.
├── export_highlights.py    # Extract highlights from Apple Books database
├── pages/
│   └── index.js           # React component for the web app
├── public/
│   └── highlights.json    # Generated highlights data
├── package.json           # Node.js dependencies
├── next.config.js         # Next.js configuration
└── .github/workflows/
    └── deploy.yml         # GitHub Actions deployment workflow
```

## Setup

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Export highlights from Apple Books:**
   ```bash
   python3 export_highlights.py
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it.

### Building for Production

```bash
npm run build
```

This creates a static export in the `out/` directory ready for GitHub Pages.

## Deployment

The project automatically deploys to GitHub Pages on every push to the `master` branch.

### To enable GitHub Pages:

1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Select `master` branch and `/root` folder
4. Wait for the first workflow to complete

Your site will be available at: `https://kwakubiney.github.io/highlights/`

## How It Works

1. **Export Script** (`export_highlights.py`):
   - Connects to Apple Books' SQLite databases
   - Retrieves all highlights with book titles and authors
   - Exports to `public/highlights.json`

2. **Web App** (`pages/index.js`):
   - Fetches the JSON data on load
   - Provides search and filtering UI
   - Implements pagination (20 highlights per page)
   - Shows color tags and note indicators

3. **GitHub Actions** (`.github/workflows/deploy.yml`):
   - Triggers on push to `master`
   - Runs `npm run build` to generate static files
   - Deploys the `out/` directory to GitHub Pages

## Requirements

- Node.js 20+
- Python 3.x (for export script)
- macOS (for Apple Books database access)

## License

MIT
