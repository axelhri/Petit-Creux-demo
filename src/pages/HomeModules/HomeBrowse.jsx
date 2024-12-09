import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../CSS/HomeModules/HomeBrowse.module.css";

function HomeBrowse() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // showcase users

  useEffect(() => {
    const userIds = [
      "67502d29ebba07ce1a95bdb1",
      "675052bfebba07ce1a95bf51",
      "67505427ebba07ce1a95bf6d",
    ];

    // fetch users infos

    const fetchUsers = async () => {
      try {
        const promises = userIds.map((id) =>
          axios.get(`https://demo-back-end.onrender.com/api/v1/auth/${id}`)
        );

        const responses = await Promise.all(promises);
        const fetchedUsers = responses.map((response) => response.data);
        setUsers(fetchedUsers);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      }
    };

    fetchUsers();
  }, []);

  // search input value added to browse url page

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/browse?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <section id={styles.homeBrowse}>
      <h3>
        <span>Parcourir</span> les recettes
      </h3>
      <div className={styles.inputContainer}>
        <form onSubmit={handleSubmit}>
          <p>Rechercher une recette</p>
          <div className={styles.homeSearch}>
            <input
              type="text"
              placeholder="Rechercher des recettes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
        </form>
      </div>

      <div className={styles.homeBrowseImage}>
        <p>Les recettes de nos utilisateurs vous attendent !</p>
        <div className={styles.usersBox}>
          {users.map((user, index) => (
            <div key={index} className={styles.userQuotes}>
              <a href={`/profile/${user.user._id}`}>
                <div className={styles.userQuotesImg}>
                  <img src={user.user.imageUrl} alt="" />
                </div>
                <span className={styles.usersName}>{user.user.name}</span>
              </a>
              <p>"{user.user.bio}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeBrowse;
