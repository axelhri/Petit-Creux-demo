import { useLocation, useNavigate } from "react-router-dom";
import styles from "../CSS/Footer.module.css";
import logo from "../assets/logo.png";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // scroll to section

  const handleSectionLink = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView();
    }
  };

  return (
    <footer id={styles.footer}>
      <div className={styles.footerLogoContainer}>
        <img src={logo} alt="logo" className={`${styles.logo}`} />
        <a href="/" className={`${styles.logoTitle}`}>
          Petit Creux
        </a>
      </div>
      <div className={styles.footerLinks}>
        <ul>
          <li>
            <a href="/">Accueil</a>
          </li>
          <li>
            <a
              onClick={() => handleSectionLink("shareSectionRef")}
              style={{ cursor: "pointer" }}
            >
              Partager
            </a>
          </li>
          <li>
            <a href="/browse">Parcourir</a>
          </li>
          <li>
            <a
              onClick={() => handleSectionLink("contactSectionRef")}
              style={{ cursor: "pointer" }}
            >
              Contact
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.footerSocials}>
        <ul>
          <li>
            <a href="">
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </li>
          <li>
            <a href="">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </li>
          <li>
            <a href="">
              <i className="fa-brands fa-facebook"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
