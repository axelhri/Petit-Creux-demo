import { useState } from "react";
import styles from "../../CSS/HomeModules/HomeContact.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomeContact() {
  const [focusedField, setFocusedField] = useState(null);
  const [values, setValues] = useState({
    name: "",
    lastname: "",
    email: "",
    formmsg: "",
  });

  // handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = {
      nom: event.target[0].value,
      prenom: event.target[1].value,
      email: event.target[2].value,
      message: event.target[3].value,
    };

    try {
      const response = await axios.post(
        "https://demo-back-end.onrender.com/api/v1/emails/send",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Message envoyé avec succés !");
      } else {
        toast.error("Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur de connexion au serveur");
    }
  }

  // focus event for input fields
  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  // blur event to reset focused field
  const handleBlur = () => {
    setFocusedField(null);
  };

  // handle change in input fields and update the state values
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <section id={styles.homeContact}>
      <h5>
        <span>Contacter-</span>nous
      </h5>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.nameContainer}>
          <div
            className={`${styles.formRow} ${
              focusedField === "nom" || values.name ? styles.focused : ""
            }`}
          >
            <input
              type="text"
              required
              id="name"
              name="name"
              value={values.name}
              onFocus={() => handleFocus("nom")}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="name">Nom *</label>
            <i className="fa-solid fa-address-card"></i>
          </div>
          <div
            className={`${styles.formRow} ${
              focusedField === "prenom" || values.lastname ? styles.focused : ""
            }`}
          >
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={values.lastname}
              onFocus={() => handleFocus("prenom")}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder=" "
            />
            <label htmlFor="lastname">Prénom</label>
            <i className="fa-solid fa-address-card"></i>
          </div>
        </div>
        <div
          className={`${styles.formRow} ${
            focusedField === "email" || values.email ? styles.focused : ""
          }`}
        >
          <input
            type="email"
            id="email"
            name="email"
            required
            value={values.email}
            onFocus={() => handleFocus("email")}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder=" "
          />
          <label htmlFor="email">Email *</label>
          <i className="fa-solid fa-envelope"></i>
        </div>
        <div
          className={`${styles.formMsg} ${
            focusedField === "message" || values.formmsg ? styles.focused : ""
          }`}
        >
          <textarea
            id="formmsg"
            name="formmsg"
            required
            value={values.formmsg}
            onFocus={() => handleFocus("message")}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder=" "
          ></textarea>
          <label htmlFor="formmsg">Message *</label>
          <i className="fa-solid fa-message"></i>
        </div>
        <span className={styles.requiredFields}>* Champs obligatoires</span>
        <div className={styles.submitBtn}>
          <button type="submit" className={styles.contactSubmit}>
            Envoyer
          </button>
        </div>
      </form>
    </section>
  );
}

export default HomeContact;
