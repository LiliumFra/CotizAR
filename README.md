# 🇦🇷 CotizAR - Dashboard Financiero Argentino

**CotizAR** es una aplicación web moderna diseñada para el monitoreo en tiempo real de indicadores financieros clave, con un enfoque particular en el contexto económico. Desarrollada con **React**, **TypeScript** y **Vite**, ofrece una experiencia de usuario rápida y receptiva.

## 🚀 Características

Basado en la arquitectura del proyecto, la aplicación incluye:

* **[span_0](start_span)[span_1](start_span)Monitoreo de Criptomonedas:** Ticker en tiempo real para cotizaciones cripto (`CryptoTicker`)[span_0](end_span)[span_1](end_span).
* **[span_2](start_span)[span_3](start_span)Datos de Inflación:** Visualización dedicada para el seguimiento de la inflación (`InflationCard`)[span_2](end_span)[span_3](end_span).
* **Análisis de Mercado:**
    * [span_4](start_span)[span_5](start_span)Gráficos interactivos principales (`MainChart`)[span_4](end_span)[span_5](end_span).
    * [span_6](start_span)[span_7](start_span)Termómetro de mercado para medir el sentimiento/volatilidad (`MarketThermometer`)[span_6](end_span)[span_7](end_span).
* **[span_8](start_span)[span_9](start_span)Noticias Financieras:** Cinta de noticias integrada (`NewsTicker`)[span_8](end_span)[span_9](end_span).
* **[span_10](start_span)[span_11](start_span)Utilidades:** Conversiones y herramientas financieras (`Tools`)[span_10](end_span)[span_11](end_span).
* **[span_12](start_span)[span_13](start_span)Sistema de Alertas:** Notificaciones para cambios importantes en el mercado (`AlertSystem`)[span_12](end_span)[span_13](end_span).

## 🛠️ Tecnologías Utilizadas

* **Core:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
* **[span_14](start_span)Build Tool:** [Vite](https://vitejs.dev/)[span_14](end_span).
* **[span_15](start_span)Estilos:** [Tailwind CSS](https://tailwindcss.com/)[span_15](end_span).
* **Gestor de Paquetes:** npm / yarn

## 📦 Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto localmente:

1.  **Clonar el repositorio**
    ```bash
    git clone [https://github.com/tu-usuario/cotizar.git](https://github.com/tu-usuario/cotizar.git)
    cd cotizar
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    [span_16](start_span)[span_17](start_span)Renombra el archivo `.env.example` a `.env` (si existe) o crea uno nuevo en la raíz para configurar tus conexiones a las APIs definidas en `src/services/api.ts`[span_16](end_span)[span_17](end_span).
    ```env
    VITE_API_URL=tu_url_de_api
    VITE_API_KEY=tu_api_key
    ```

4.  **Iniciar el servidor de desarrollo**
    ```bash
    npm run dev
    ```

## 📂 Estructura del Proyecto

```text
src/
├── components/       # Componentes de UI (Gráficos, Tarjetas, Tickers)
├── services/         # Lógica de conexión a APIs externas (api.ts)
├── types/            # Definiciones de tipos TypeScript (types.ts)
├── App.tsx           # Componente principal
└── main.tsx          # Punto de entrada
