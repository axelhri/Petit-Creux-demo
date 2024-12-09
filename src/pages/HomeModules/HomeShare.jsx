import styles from "../../CSS/HomeModules/HomeShare.module.css";
import img1 from "../../images/shareImg.jpg";
import img2 from "../../images/homeShare.jpg";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import HomeShareRecipe from "../HomeShareRecipe.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomeShare() {
  const { isAuthenticated } = useContext(AuthContext);
  const recipeSectionRef = useRef(null);

  // scroll to section if connected, if not a pop up appears

  const handleShareClick = (event) => {
    event.preventDefault();
    if (isAuthenticated) {
      const topOffset =
        recipeSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        50;
      window.scrollTo(0, topOffset);
    } else {
      toast("Veuillez vous connecter pour accéder à cette fonctionalité");
    }
  };

  return (
    <section id={styles.homeShare}>
      <h2>
        <span>Partager</span> vos recettes
      </h2>
      <div className={styles.homeShareFlex}>
        <div className={styles.homeShareText}>
          <span>Vos recettes, votre inspiration</span>
          <p>
            Partagez vos créations culinaires et inspirez notre communauté de
            passionnés de cuisine. Chaque recette a une histoire, et la vôtre
            pourrait devenir la préférée de quelqu'un !
          </p>
          <a href="#" onClick={handleShareClick}>
            Partager une recette
          </a>
        </div>
        <div className={styles.homeShareImage}>
          <img src={img1} alt="" />
          <img src={img2} alt="" />
        </div>
      </div>
      <div id="HomeShareRecipe" ref={recipeSectionRef}>
        {isAuthenticated && <HomeShareRecipe />}
      </div>
    </section>
  );
}

export default HomeShare;
