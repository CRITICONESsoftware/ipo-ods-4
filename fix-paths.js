const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

function fixPaths() {
  console.log('Fijando rutas relativas en la carpeta out...');
  
  walkDir(outDir, (filePath) => {
    // Solo modificar archivos HTML, JS y CSS
    if (!filePath.match(/\.(html|js|css)$/)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Calcular la profundidad relativa desde el archivo hasta la carpeta out
    const relativeDepth = path.relative(path.dirname(filePath), outDir);
    const prefix = relativeDepth === '' ? '.' : relativeDepth;
    
    // 1. Reemplazar "/_next/ a "./_next/" o "../_next/"
    content = content.replace(/(href|src)="\/_next\//g, `$1="${prefix}/_next/`);
    
    // 2. Reemplazar rutas publicas basicas como "/icon.webp" a "./icon.webp"
    content = content.replace(/(href|src)="\/([^"]+\.(png|webp|jpg|jpeg|svg|gif|ico|css|js))"/g, `$1="${prefix}/$2"`);

    // 3. Modificar los Next Links para que apunten a los verdaderos .html
    // Reemplaza href="/login" con href="./login.html"
    content = content.replace(/href="\/([a-zA-Z0-9_\-]+)"/g, `href="${prefix}/$1.html"`);
    
    // Arreglar el home (href="/")
    content = content.replace(/href="\/"/g, `href="${prefix}/index.html"`);

    // Guardar los cambios
    fs.writeFileSync(filePath, content);
  });

  console.log('¡Rutas fijadas! Ahora debería verse mucho mejor al hacer doble clic.');
}

fixPaths();
