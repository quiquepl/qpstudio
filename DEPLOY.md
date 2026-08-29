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
- **El NIF de los textos legales.** El aviso legal y la política de privacidad
  ya llevan domicilio y están desarrollados, pero el NIF sigue como
  `[NIF pendiente]`. Se cambia en un solo sitio: la constante `T` de
  `build-pages.mjs`, y luego `node build-pages.mjs`. La LSSI-CE exige ese dato.
  Conviene además que un profesional revise los tres textos antes de darlos por
  cerrados.
- **Los textos del panel.** La bandeja de mensajes ya es real, pero los textos
  y los bloques que se editan siguen guardándose en `localStorage`, o sea solo
  en el navegador de quien los toca. Llevarlos a la base de datos exige decidir
  antes cómo los lee la web: si se consultan en cada carga, se pierde velocidad
  y posicionamiento; lo razonable es regenerar las páginas al guardar.
- **Aviso por correo.** Cuando llega un mensaje se guarda, pero no avisa a nadie.
  Hasta que se conecte un envío de correo (Resend o similar), hay que entrar al
  panel a mirar.
- **Imágenes del portátil.** Son un MacBook con el logo de Apple. Los mockups de
  dispositivo son práctica común, pero Apple restringe el uso de su marca en
  material comercial. Decide si las dejas o las cambias por un render genérico.

## Base de datos (Neon)

El proyecto es `lingering-shadow-50729060`, en la organización `qpstudio`,
región `aws-us-east-2`. La rama de trabajo es `production`.

El enlace del repositorio con el proyecto vive en `.neon`, que no se sube a
Git. Si clonas el proyecto en otro ordenador:

```bash
npx neon@latest auth
npx neon@latest link --org-id org-proud-mode-81915204 --project-id lingering-shadow-50729060
```

Eso deja las variables en `.env.local`. Después, el esquema:

```bash
npm install
npm run migrate
```

### Migraciones

Los ficheros `.sql` de `db/` se aplican por orden de nombre y quedan anotados
en la tabla `migraciones`, así que volver a ejecutarlo no repite nada. Para
cambiar el esquema, añade un fichero nuevo; no edites uno ya aplicado.

Se usa la conexión **directa** (`DATABASE_URL_UNPOOLED`), no la del pooler:
es lo que pide Neon para cambios de esquema. Las funciones, en cambio, usan
la del pooler (`DATABASE_URL`), que es lo correcto en serverless.

### Variables

| Variable | Para qué |
| --- | --- |
| `DATABASE_URL` | conexión de las funciones, por el pooler |
| `DATABASE_URL_UNPOOLED` | conexión directa, solo migraciones |
| `ADMIN_USUARIO` | usuario del panel |
| `ADMIN_CLAVE_HASH` | hash scrypt de la contraseña |
| `SESION_SECRETO` | firma de la cookie de sesión y del hash de IP |

Están puestas en Vercel en los tres entornos. En local salen de `.env.local`,
que además guarda `ADMIN_CLAVE` en claro como recordatorio: el servidor no la
lee, lee el hash.

**Cambiar la contraseña del panel:**

```bash
node scripts/clave-admin.mjs "la nueva contraseña"
```

Imprime la línea `ADMIN_CLAVE_HASH=…`. Ponla en `.env.local` y súbela a los
tres entornos de Vercel. `node scripts/comprobar-clave.mjs` dice si la
contraseña y el hash del fichero se corresponden.

### Cómo está protegido el panel

La contraseña no se guarda en ningún sitio: se guarda un hash scrypt con sal,
y al entrar se compara en tiempo constante para que el tiempo de respuesta no
delate nada. La sesión es una cookie firmada con HMAC-SHA256, `HttpOnly` (el
JavaScript de la página no la puede leer), `SameSite=Strict` (no viaja desde
otros sitios) y `Secure` en https. Dura ocho horas.

`/api/admin/mensajes` comprueba la sesión **antes** de tocar la base de datos.
Sin cookie válida devuelve 401 y no consulta nada.

### Antiabuso del formulario

Máximo cinco mensajes por hora desde el mismo sitio. Para contarlos no se
guarda la IP sino un HMAC de la IP con `SESION_SECRETO`, que no permite
recuperar la dirección. Es lo que la política de privacidad llama datos
técnicos.

### Desarrollo local

`server.mjs` enruta `/api/*` a los módulos de `api/`, imitando a Vercel, así
que `npm run dev` sirve la web y las funciones a la vez. No hace falta
`vercel dev`.

## Caché

`vercel.json` fija cuánto tiempo guarda el navegador cada cosa:

- **`/css/` y `/js/`** → `max-age=0, must-revalidate`. En cada visita el
  navegador pregunta y Vercel contesta `304 Not Modified` si nada ha
  cambiado (respuesta vacía, coste casi nulo). Así, en cuanto despliegas,
  todo el mundo ve la versión nueva. Los ficheros no llevan hash en el
  nombre, así que sin esto un cambio tardaba hasta una hora en llegar a
  quien ya hubiera entrado.
- **`/img/`** → un año e `immutable`. Las imágenes no cambian; si algún
  día sustituyes una, renómbrala (`logo-2.png`) en vez de sobrescribirla.

Si algún día la web crece y el CSS pesa, la solución no es subir el
`max-age`, es poner un hash en el nombre del fichero y entonces sí
cachearlo un año.
