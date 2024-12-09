import { useRouteError } from "react-router-dom";
import NotFoundImage from "../assets/not-found.svg?react";
import styles from "../CSS/ErrorPage.module.css";

function ErrorPage() {
  const error = useRouteError();
  console.log(error);

  if (error.status === 404) {
    return (
      <main id={styles.errorPageMain}>
        <NotFoundImage className={styles.errorImage} />
        <section>
          <h1>La page que vous recherchez n&apos;existe pas.</h1>
          <a href="/">Revenir a l'accueil</a>
        </section>
      </main>
    );
  }

  return (
    <main id={styles.errorPageMain}>
      <h1>Quelque chose d'innatendu s'est passé.</h1>
      <a href="/">Revenir a l'accueil</a>
    </main>
  );
}

export default ErrorPage;
