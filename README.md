# Presupuesto App

Esta aplicación es un generador de presupuestos implementado con **Next.js** y **TypeScript**. Permite ingresar datos para una cotización, agregar ítems/servicios, calcular totales y generar un PDF de forma dinámica. Además, utiliza componentes de Bootstrap para el estilo y varias utilidades para el manejo de fechas, formateo de moneda y generación del PDF.

## Características

- **Generación de PDF:** Utiliza [pdf-lib](https://pdf-lib.js.org/) para crear documentos PDF a partir de la información ingresada.
- **Interfaz de usuario:** Basada en React, con formularios para ingresar datos y administrar servicios.
- **Estilos:** Se usa Bootstrap junto con estilos globales personalizados.
- **Gestión de fechas:** [react-datepicker](https://reactdatepicker.com/) y [date-fns](https://date-fns.org/) para el manejo de fechas.
- **Automatización de pruebas y despliegue:** Configuración lista para desarrollo con Next.js y TypeScript.

## Instalación y Configuración

### Requisitos Previos

- Tener instalado [Node.js](https://nodejs.org/) (versión 14 o superior).
- Tener un gestor de paquetes (npm o yarn).

### Clonar el Repositorio

Clona el repositorio desde GitHub:

```bash
git clone https://github.com/USERNAME/REPOSITORY.git
cd REPOSITORY
```

### Instalación de Dependencias

Ejecuta el siguiente comando en la raíz del proyecto para instalar todas las dependencias:

#### **Usando npm:**
```bash
npm install
```

#### **Usando Yarn:**
```bash
yarn install
```

### Instalación de Dependencias Individuales

#### **Dependencias principales**:
Estas son las dependencias necesarias para que la aplicación funcione.

##### **Usando npm:**
```bash
npm install next react react-dom typescript bootstrap react-datepicker date-fns pdf-lib file-saver
```

##### **Usando Yarn:**
```bash
yarn add next react react-dom typescript bootstrap react-datepicker date-fns pdf-lib file-saver
```

#### **Dependencias de desarrollo**:
Estas se utilizan para mejorar la experiencia de desarrollo y evitar errores en tiempo de compilación.

##### **Usando npm:**
```bash
npm install --save-dev @types/node @types/react @types/react-dom eslint prettier
```

##### **Usando Yarn:**
```bash
yarn add -D @types/node @types/react @types/react-dom eslint prettier
```

### **Explicación de cada dependencia**:

| Dependencia       | Descripción |
|-------------------|------------|
| `next`           | Framework de React para renderizado del lado del servidor y generación de sitios estáticos. |
| `react`          | Biblioteca principal para crear interfaces de usuario en React. |
| `react-dom`      | Proporciona métodos específicos para el uso de React en el navegador. |
| `typescript`     | Superset de JavaScript que agrega tipado estático. |
| `bootstrap`      | Framework de CSS para diseñar interfaces responsivas y modernas. |
| `react-datepicker` | Componente de selector de fecha para React. |
| `date-fns`       | Biblioteca para manipulación de fechas en JavaScript. |
| `pdf-lib`        | Biblioteca para la generación y modificación de documentos PDF en JavaScript. |
| `file-saver`     | Utilidad para guardar archivos localmente desde el navegador. |

### **Dependencias de desarrollo:**

| Dependencia       | Descripción |
|-------------------|------------|
| `@types/node`    | Definiciones de tipos para Node.js en TypeScript. |
| `@types/react`   | Definiciones de tipos para React en TypeScript. |
| `@types/react-dom` | Definiciones de tipos para React-DOM en TypeScript. |
| `eslint`         | Herramienta para encontrar y corregir errores en el código JavaScript/TypeScript. |
| `prettier`       | Formateador de código para mantener un estilo limpio y consistente. |

### Configuración Adicional

El proyecto utiliza un archivo `tsconfig.json` con las siguientes configuraciones clave:

- **Modo estricto:** Se habilita `strict` para mejorar la calidad del código.
- **Resolución de módulos:** Configuración para utilizar alias de rutas (`@/*`), facilitando la importación de módulos.
- **Soporte para JSX:** Configurado para ser compatible con la sintaxis de React.

## Scripts del Proyecto

Dentro del `package.json` se definen los siguientes scripts:

### Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

### Build

Genera la versión de producción:

```bash
npm run build
```

### Start

Inicia la aplicación en modo producción:

```bash
npm run start
```

### Lint

Ejecuta el linter para revisar el código:

```bash
npm run lint
```

## Uso de la Aplicación

Ejecuta el proyecto en modo desarrollo:

```bash
npm run dev
```

Abre tu navegador y navega a `http://localhost:3000` para ver la aplicación en acción.

1. Interactúa con el formulario: Ingresa los datos de la cotización, añade o elimina servicios.
2. Utiliza los botones para previsualizar o descargar el PDF.

## Estructura del Proyecto

```
/src               # Carpeta principal que contiene el código fuente
  ├── components   # Componentes React reutilizables (Formulario, BotonPDF, etc.)
  ├── utils        # Funciones utilitarias como pdfutils.ts y common.ts
  ├── types        # Definiciones de interfaces y tipos TypeScript
  ├── pages        # Páginas de Next.js (page.tsx y otras)
/public            # Archivos estáticos
globals.css        # Estilos globales personalizados
```

## Contribuciones

Si deseas contribuir, por favor sigue los siguientes pasos:

1. Crea un fork del repositorio.
2. Crea una nueva rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commits descriptivos.
4. Envía un pull request explicando los cambios realizados.

## Licencia

Este proyecto se distribuye bajo una **licencia privada**.

---

¡Gracias por utilizar **Presupuesto App**! Si tienes alguna duda o sugerencia, por favor abre un issue en el repositorio.