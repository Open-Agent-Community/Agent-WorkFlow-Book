/**
 * Applies the stored or system colour scheme before hydration to avoid a flash.
 * This is the only inline script in the app; it only toggles the `dark` class on <html>.
 */
export const themeInitScript =
  "try{var s=localStorage.getItem('theme');" +
  "var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;" +
  "document.documentElement.classList.toggle('dark',d)}catch(e){}";
