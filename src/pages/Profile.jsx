import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styles from "../CSS/Profile.module.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "./Loader.jsx";

const recipesUrl =
  "https://demo-back-end.onrender.com/api/v1/recipes/test/?createdBy=";

function Profile() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(null);

  // change profile image

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  useEffect(() => {
    if (userData && userData.imageUrl) {
      setPreviewImage(userData.imageUrl);
    }
  }, [userData]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleDeleteClick = () => {
    setShowDeleteBox(true);
  };

  const handleCloseDeleteBox = () => {
    setShowDeleteBox(false);
  };

  // fetch user and all their recipes

  const fetchUserProfileAndRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/auth/${userId}`
      );
      setUserData(response.data.user);
      setName(response.data.user.name);
      setBio(response.data.user.bio);
      setEmail(response.data.user.email);

      const recipesResponse = await axios.get(`${recipesUrl}${userId}`);
      setUserRecipes(recipesResponse.data.recipes);
      setLoading(false);
    } catch (error) {
      setError(
        "Erreur lors de la récupération des informations utilisateur ou des recettes."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfileAndRecipes();
    } else {
      setError("Aucun utilisateur spécifié.");
      setLoading(false);
    }
  }, [userId]);

  // update every profile infos

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("bio", bio);
    formData.append("password", password);
    if (profileImage) {
      formData.append("image", profileImage);
    }

    try {
      await axios.put(`http://localhost:5000/api/v1/auth/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUserData((prev) => ({
        ...prev,
        name,
        email,
        imageUrl: profileImage
          ? URL.createObjectURL(profileImage)
          : prev.imageUrl,
      }));
      setShowUpdateForm(false);
      setError(null);
      toast.success("Profil mis à jour.");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil.");
    }
  };

  // deactivate account forever

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/auth/${userId}`);
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      navigate("/");
      toast("Votre compte a été supprimé avec succès");
    } catch (error) {
      setError("Erreur lors de la suppression du compte.");
    }
  };

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const currentUserId = localStorage.getItem("userId");

  return (
    <main id={styles.profileMain}>
      <section className={styles.profileTopSection}>
        <div className={styles.settings}>
          {currentUserId === userId && (
            <div className={styles.settingsBox}>
              <button onClick={toggleMenu}>
                <i className="fa-solid fa-gear"></i>
              </button>
              <div
                className={`${styles.settingsMenu} ${
                  menuOpen ? styles.open : ""
                }`}
              >
                <ul className={styles.settingsList}>
                  <li className={styles.modifyAccount}>
                    <button onClick={() => setShowUpdateForm(!showUpdateForm)}>
                      Modifier le profil
                    </button>
                  </li>
                  <li className={styles.deleteAccount}>
                    <button onClick={handleDeleteClick}>
                      Supprimer le compte
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
          <div className={styles.profileDesc}>
            {userData && (
              <img
                src={userData.imageUrl}
                alt="Profile"
                className={styles.profileImage}
              />
            )}
          </div>
        </div>

        {showUpdateForm && (
          <form
            id={styles.form}
            className={styles.updateProfilForm}
            onSubmit={handleUpdateProfile}
          >
            <div className={styles.modifyProfileContainer}>
              <button
                type="button"
                className={styles.closeFormButton}
                onClick={() => setShowUpdateForm(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <h1>Modifier le profil</h1>
              <div className={styles.udpateProfilImage}>
                <img
                  src={previewImage}
                  alt="Aperçu de l'image de profil"
                  className={styles.profilePreviewImage}
                />
                <i className="fa-solid fa-camera"></i>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="bio">bio :</label>
                <input
                  type="text"
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  onFocus={(e) => (e.target.value = "")}
                  required
                />
                <i className="fa-solid fa-pen"></i>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="name">Nom :</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => (e.target.value = "")}
                  required
                />
                <i className="fa-solid fa-pen"></i>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="name">Email :</label>

                <input
                  type="email"
                  id="email"
                  onFocus={(e) => (e.target.value = "")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <i className="fa-solid fa-pen"></i>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Mot de passe :</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <i className="fa-solid fa-pen"></i>
              </div>
              <div className={styles.updateProfilButton}>
                <button type="submit">Mettre à jour le profil</button>
              </div>
            </div>
          </form>
        )}

        {showDeleteBox && (
          <div className={styles.deleteBox}>
            <i className="fa-solid fa-xmark" onClick={handleCloseDeleteBox}></i>
            <div className={styles.deleteBoxContent}>
              <p>
                Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
              </p>
              <button onClick={handleDeleteAccount}>
                Supprimer<i className="fa-solid fa-triangle-exclamation"></i>
              </button>
            </div>
          </div>
        )}
      </section>
      <div className={styles.userNameBox}>
        <h1 className={styles.username}>
          {userData ? userData.name : "Visiteur"}
        </h1>
        <p>{userData.bio}</p>
        <h2 className={styles.sharedRecipesTitle}>
          {userRecipes.length >= 0
            ? `Recette partagée par ${
                userData ? userData.name : "l'utilisateur"
              } :`
            : `Recettes partagées par ${
                userData ? userData.name : "l'utilisateur"
              } :`}
        </h2>
      </div>
      <section className={styles.profileBottomSection}>
        {userRecipes.length > 0
          ? userRecipes.map((recipe) => (
              <article key={recipe._id}>
                <a href={`/recipes/${recipe._id}`}>
                  <div className={styles.articleImgContainer}>
                    <img src={recipe.imageUrl} alt={recipe.title} />
                  </div>
                  <div className={styles.articleDesc}>
                    <div className={styles.nameCategoryBox}>
                      <span className={styles.articleRecipeName}>
                        {recipe.title}
                      </span>
                      <p>{recipe.categories}</p>
                    </div>
                    <div className={styles.recipeDesc}>
                      <p>{recipe.description}</p>
                    </div>
                    <div className={styles.articleBtnContainer}>
                      <button className={styles.articleBtn}>Voir plus</button>
                    </div>
                  </div>
                </a>
              </article>
            ))
          : null}
      </section>
      {userRecipes.length === 0 && (
        <div className={styles.noRecipesBox}>
          {currentUserId === userId ? (
            <>
              <p>Vous n'avez pas encore de recette.</p>
              <a href="/share">Création de recette</a>
            </>
          ) : (
            <p>Aucune recette partagée par cet utilisateur.</p>
          )}
        </div>
      )}
    </main>
  );
}

export default Profile;
