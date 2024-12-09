import { useEffect, useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "../CSS/Home.module.css";
import { AuthContext } from "../context/AuthContext";
import HomeShare from "./HomeModules/HomeShare";
import HomeBrowse from "./HomeModules/HomeBrowse";
import HomeContact from "./HomeModules/HomeContact";
import LoginForm from "./Login";

function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const recipeSectionRef = useRef(null);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const location = useLocation();

  // home background

  useEffect(() => {
    document.body.className = styles.backgroundHome;

    return () => {
      document.body.className = "";
    };
  }, []);

  // get started button either scroll to share section or open login form

  const handleGetStartedClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      const topOffset =
        recipeSectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        50;
      window.scrollTo(0, topOffset);
    } else {
      setIsLoginVisible((prev) => !prev);
    }
  };

  // scroll to section from another page

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const section = document.getElementById(location.state.scrollTo);
        section?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.state]);

  return (
    <>
      {isLoginVisible && <LoginForm onClose={handleGetStartedClick} />}
      <header id={styles.header}>
        <div className={styles.headerContainer}>
          <h1 className={styles.headerTitle}>
            Partagez vos recettes au monde entier !
          </h1>
          <div className={styles.headerBtnContainer}>
            <a
              href="#"
              onClick={handleGetStartedClick}
              className={styles.getStartedBtn}
            >
              Je commence<i className="fa-solid fa-arrow-right"></i>
              <div className={styles.btnBgw}></div>
              <div className={styles.btnBg}></div>
            </a>
          </div>
        </div>
        <div className={styles.arrowContainer}>
          <a href="#homeMain">
            défilez vers le bas
            <i className="fa-solid fa-chevron-down"></i>
          </a>
        </div>
      </header>
      <main id="homeMain">
        <div id="shareSectionRef" ref={recipeSectionRef}>
          <HomeShare />
        </div>
        <HomeBrowse />
        <div id="contactSectionRef">
          <HomeContact />
        </div>
      </main>
    </>
  );
}

export default Home;
