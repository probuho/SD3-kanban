import i18n from "i18n";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

i18n.configure({
  locales: ["en", "es"], // Idiomas soportados
  directory: join(__dirname, "../locales"), // Ruta a los archivos de traducción
  defaultLocale: "en", // Idioma por defecto
  cookie: "lang", // Nombre de la cookie para almacenar el idioma
  queryParameter: "lang", // Parámetro de consulta para cambiar el idioma
  autoReload: true, // Recargar archivos de traducción automáticamente
  syncFiles: true, // Sincronizar archivos de traducción
  objectNotation: true, // Usar notación de objetos en las traducciones
});

export default i18n;