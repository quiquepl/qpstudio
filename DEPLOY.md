# DEPLOY.md — QP Studio

Web estática. No hay build: lo que hay en el repositorio es lo que se publica.

## 1. Crear el repositorio en GitHub

En GitHub, **New repository**:

- Nombre: `qp-studio`
- Visibilidad: privado o público, da igual para Vercel.
- **No** marques «Add a README», «Add .gitignore» ni licencia. El repositorio
  local ya tiene commits y si GitHub crea un commit inicial habrá conflicto.

Luego, desde la carpeta del proyecto:

```bash
git remote add origin https://github.com/TU-USUARIO/qp-studio.git
git branch -M main
git push -u origin main
```

## 2. Entorno de pruebas con ramas

El repositorio ya tiene dos ramas:

| Rama | Para qué | Dónde acaba |
|---|---|---|
| `main` | Lo que ve el cliente | Dominio de producción |
| `staging` | Pruebas y cambios en curso | URL de preview de Vercel |

Sube también la rama de pruebas:

```bash
git push -u origin staging
```

**Cómo se trabaja a partir de ahora.** Nunca se toca `main` directamente:

```bash
git checkout staging          # te pones en pruebas
# ...cambios...
git add -A
git commit -m "Lo que has cambiado"
git push                      # Vercel genera una preview con su URL
```

Cuando la preview esté bien, se pasa a producción:

```bash
git checkout main
git merge staging
git push                      # Vercel publica en el dominio real
git checkout staging          # y vuelves a pruebas
```

Para un cambio concreto conviene una rama propia a partir de `staging`
(`git checkout -b arreglo-formulario`). Vercel también le da su propia URL de
preview, y al abrir un Pull Request la deja comentada en el propio PR.

## 3. Conectar Vercel

1. Entra en vercel.com con la cuenta de GitHub.
2. **Add New → Project** e importa `qp-studio`.
3. Framework Preset: **Other**. Build Command y Output Directory: **vacíos**.
   Es una web estática, no hay nada que compilar.
4. Deploy.

Con eso Vercel ya queda configurado así por defecto:

- Cada push a `main` publica en producción.
- Cada push a `staging` o a cualquier otra rama genera un **Preview
  Deployment** con su propia URL, aislada y con los mismos ficheros.

En **Settings → Git**, comprueba que *Production Branch* es `main`. Si quieres
que las previews no sean públicas, en **Settings → Deployment Protection**
activa *Vercel Authentication* para Preview.

## 4. Dominio

En **Settings → Domains**, añade el dominio y sigue las instrucciones de DNS.
Vercel emite el certificado solo.

## 5. Lo que falta antes de publicar de verdad

- **Datos de contacto reales.** `js/ui.js`, objeto `CONTACTO` (correo y
  WhatsApp), y los mismos valores escritos a mano en el HTML.
- **Textos legales.** `aviso-legal.html`, `privacidad.html` y `cookies.html`
  están redactados como base, sin NIF ni domicilio. Hay que completarlos y
  revisarlos.
- **El formulario.** Ahora abre el cliente de correo. Para recibir los mensajes
  de verdad hace falta un endpoint (Formspree, o una función en `api/` de Vercel
  con Resend).
- **El panel de administración.** `admin.html` guarda en el navegador y el
  acceso se comprueba en el propio JavaScript, así que **no protege nada**.
  Antes de que sea real hace falta base de datos, autenticación en el servidor
  y el endpoint del formulario.
- **Imágenes del portátil.** Son un MacBook con el logo de Apple. Los mockups de
  dispositivo son práctica común, pero Apple restringe el uso de su marca en
  material comercial. Decide si las dejas o las cambias por un render genérico.
