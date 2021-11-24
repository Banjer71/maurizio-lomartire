import "../styles/globals.css";
import "../pages/layout/main-page.css";
import "../pages/content/content.css";
import "../pages/social-media/social-media.css";
import "../pages/sidebar/sidebar.css";
import "../pages/navbar/navbar.css";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
