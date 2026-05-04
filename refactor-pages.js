const fs = require('fs');
const path = require('path');

const srcPages = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(srcPages);

const pages = new Set();
files.forEach(f => {
  if (f.endsWith('.jsx')) {
    pages.add(f.replace('.jsx', ''));
  }
});

pages.forEach(page => {
  const pageDir = path.join(srcPages, page);
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir);
  }
  
  const jsxOld = path.join(srcPages, `${page}.jsx`);
  const cssOld = path.join(srcPages, `${page}.css`);
  
  const jsxNew = path.join(pageDir, `${page}.jsx`);
  const cssNew = path.join(pageDir, `${page}.css`);
  
  if (fs.existsSync(jsxOld)) {
    let content = fs.readFileSync(jsxOld, 'utf8');
    // update imports: ../ to ../../
    content = content.replace(/from\s+['"]\.\.\//g, "from '../../");
    content = content.replace(/import\s+['"]\.\.\//g, "import '../../");
    
    fs.writeFileSync(jsxNew, content);
    fs.unlinkSync(jsxOld);
  }
  
  if (fs.existsSync(cssOld)) {
    fs.renameSync(cssOld, cssNew);
  }
});

// Handle AuthPage.css
const authCssOld = path.join(srcPages, 'AuthPage.css');
if (fs.existsSync(authCssOld)) {
  const authDir = path.join(srcPages, 'AuthPage');
  if (!fs.existsSync(authDir)) fs.mkdirSync(authDir);
  fs.renameSync(authCssOld, path.join(authDir, 'AuthPage.css'));
  
  // Update imports in LoginPage, RegisterPage, ForgotPasswordPage
  ['LoginPage', 'RegisterPage', 'ForgotPasswordPage'].forEach(page => {
    const p = path.join(srcPages, page, `${page}.jsx`);
    if (fs.existsSync(p)) {
      let c = fs.readFileSync(p, 'utf8');
      c = c.replace(/import\s+['"]\.\/AuthPage\.css['"]/g, "import '../AuthPage/AuthPage.css'");
      fs.writeFileSync(p, c);
    }
  });
}

// Update App.jsx
const appPath = path.join(__dirname, 'src', 'App.jsx');
if (fs.existsSync(appPath)) {
  let appContent = fs.readFileSync(appPath, 'utf8');
  appContent = appContent.replace(/import\s+([A-Za-z0-9_]+)\s+from\s+['"]\.\/pages\/([A-Za-z0-9_]+)['"]/g, "import $1 from './pages/$2/$2'");
  fs.writeFileSync(appPath, appContent);
}

console.log("Refactoring complete");
