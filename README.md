# Samia Sharmin Portfolio

This is a static multi-page portfolio site designed for GitHub Pages. It uses the source files in `json_files/`, `md_files/`, and `images/` directly, so there is no build step.

## Local preview

Because the site fetches local JSON and Markdown files, open it with a local server instead of double-clicking `index.html`.

### PowerShell

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages deployment

1. Push this repository to GitHub.
2. In the repository settings, open `Pages`.
3. Set the source to `Deploy from a branch`.
4. Choose your main branch and the `/ (root)` folder.
5. Save the settings.

The site uses relative paths, so it works both for a custom domain and for project-style GitHub Pages URLs such as `https://username.github.io/repository-name/`.
