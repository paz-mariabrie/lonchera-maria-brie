# Lonchera María Brie — Formulario de suscripción

Proyecto listo para desplegar en Vercel.

## Cómo publicar (guía paso a paso)

### 1. Crea cuenta en GitHub (gratis)
- Ve a https://github.com y haz clic en "Sign up"
- Usa tu email y elige un usuario (por ejemplo: `paz-mariabrie`)

### 2. Sube este proyecto a GitHub
Opción fácil (desde el navegador):
- Una vez dentro de GitHub, haz clic en el "+" arriba a la derecha → "New repository"
- Nombre del repositorio: `lonchera-maria-brie`
- Déjalo como **Public** (público)
- NO marques "Add a README"
- Haz clic en "Create repository"
- En la siguiente pantalla, elige "uploading an existing file"
- Arrastra TODA esta carpeta (`lonchera-maria-brie`) al recuadro. Arrastra los archivos y carpetas de adentro, no la carpeta completa.
- Espera a que todo suba (puede tardar 1-2 min)
- Al final, haz clic en "Commit changes"

### 3. Crea cuenta en Vercel (gratis)
- Ve a https://vercel.com
- Haz clic en "Sign up"
- Elige "Continue with GitHub" (se conecta directo con la cuenta que creaste)

### 4. Publica el proyecto en Vercel
- Una vez dentro de Vercel, haz clic en "Add New... → Project"
- Vas a ver la lista de tus repositorios de GitHub
- Busca `lonchera-maria-brie` y haz clic en "Import"
- No cambies nada de la configuración (Vercel detecta que es Vite automáticamente)
- Haz clic en "Deploy"
- Espera 1-2 minutos

### 5. Listo
- Vercel te dará un link público tipo:
  `https://lonchera-maria-brie.vercel.app`
- Ese link es permanente. Lo puedes mandar por WhatsApp o usar en Squarespace.

## Cómo actualizar el formulario después

Cuando quieras cambiar algo (agregar producto al menú, cambiar precio, etc.):
1. Modifica el archivo `src/LoncheraMariaBrie.jsx` directamente en GitHub (botón del lápiz)
2. Haz clic en "Commit changes"
3. Vercel detecta el cambio y publica la nueva versión automáticamente en 1 minuto

## Cómo agregar un botón en Squarespace

1. En el editor de Squarespace, ve a la página donde quieres el botón
2. Agrega un bloque de tipo "Button"
3. En "Link", pega el link de Vercel: `https://lonchera-maria-brie.vercel.app`
4. Texto del botón: "Suscríbete a Lunch Box"
5. Marca "Open in new window" para que no salga de tu página

## Costos
- GitHub: gratis
- Vercel: gratis (plan Hobby aguanta miles de visitas al mes)
- Tu dominio: si quieres uno tipo `loncheras.maria-brie.mx` cuesta ~$10 USD/año pero no es obligatorio
