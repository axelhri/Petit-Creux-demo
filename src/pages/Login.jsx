import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "../CSS/login.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // form submit

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://demo-back-end.onrender.com/api/v1/auth/login",
        formData
      );

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.userId);

      setIsAuthenticated(true);
      navigate("/");
      if (onClose) onClose();
    } catch (error) {
      console.error("Login error", error.response.data);

      if (error.response && error.response.data) {
        toast.error("Identifiants invalides");
      }
    }
  };

  return (
    <form onSubmit={onSubmit} id={styles.form}>
      <div onClick={onClose} className={styles.closeBtn}>
        <i className="fa-solid fa-xmark"></i>
      </div>
      <h1 className={styles.formTitle}>Se connecter</h1>
      <div className={styles.inputContainer}>
        <div className={styles.inputBox}>
          <input
            type="email"
            name="email"
            value={email}
            className={styles.formInput}
            onChange={onChange}
            placeholder="Email"
            required
          />
          <i className="fa-regular fa-envelope"></i>
        </div>
        <div className={styles.inputBox}>
          <input
            type="password"
            name="password"
            value={password}
            className={styles.formInput}
            onChange={onChange}
            placeholder="Mot de passe"
            required
          />
          <i className="fa-solid fa-lock"></i>
        </div>
      </div>
      <button type="submit" className={styles.submitBtn}>
        Connexion
      </button>
    </form>
  );
};

export default Login;
