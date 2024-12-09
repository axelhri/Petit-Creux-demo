import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../CSS/Login.module.css";
import { useNavigate } from "react-router-dom";
import defaultImg from "../images/user.png";

const Register = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(defaultImg);
  const navigate = useNavigate();
  const { name, email, password } = formData;
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // upload profile image

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // form submit

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      if (image) {
        data.append("image", image);
      }

      const res = await axios.post(
        "https://demo-back-end.onrender.com/api/v1/auth/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("User registered", res.data);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", user._id);

      navigate("/");
      if (onClose) onClose();
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={onSubmit} id={styles.form}>
      <div onClick={onClose} className={styles.closeBtn}>
        <i className="fa-solid fa-xmark"></i>
      </div>
      <h1 className={styles.formTitle}>Créer un compte</h1>
      <div className={styles.inputContainer}>
        <div className={styles.uploadImage}>
          <img src={previewImage} alt="Profil" className={styles.userImage} />
          <i className="fa-solid fa-camera"></i>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={onImageChange}
            required
          />
        </div>
        <div className={styles.inputBox}>
          <input
            type="text"
            name="name"
            value={name}
            className={styles.formInput}
            onChange={onChange}
            placeholder="Nom"
            required
          />
          <i className="fa-regular fa-user"></i>
        </div>

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
        Créer un compte
      </button>
    </form>
  );
};

export default Register;
