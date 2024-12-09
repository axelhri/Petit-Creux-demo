import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import styles from "../CSS/Browse.module.css";
import img1 from "../images/browseimg1.jpg";
import img2 from "../images/browseimg2.jpg";
import Loader from "./Loader.jsx";

const recipesUrl = "https://demo-back-end.onrender.com/api/v1/recipes/all";
const userUrl = "https://demo-back-end.onrender.com/api/v1/auth/";

function Browse() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchTerm = queryParams.get("search") || "";

  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [userProfiles, setUserProfiles] = useState({});

  // fetch recipes from all the users

  const fetchAllRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(recipesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const recipes = response.data.recipes;
      setAllRecipes(recipes);
      setFilteredRecipes(recipes);

      const uniqueCategories = [
        ...new Set(recipes.flatMap((recipe) => recipe.categories || [])),
      ];
      setCategories(uniqueCategories);

      const userIds = [...new Set(recipes.map((recipe) => recipe.createdBy))];
      const userResponses = await Promise.all(
        userIds.map((id) =>
          axios
            .get(`${userUrl}${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .catch(() => null)
        )
      );
      const profiles = userResponses.reduce((acc, res) => {
        if (res && res.data) {
          acc[res.data.user._id] = res.data.user;
        }
        return acc;
      }, {});
      setUserProfiles(profiles);

      setLoading(false);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des recettes :",
        error.response ? error.response.data : error.message
      );
      if (error.response && error.response.status === 401) {
        setError("Vous devez être connecté pour accéder à cette ressource.");
      } else {
        setError("Erreur lors de la récupération des recettes.");
      }
      setLoading(false);
    }
  };

  // search input for recipes

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterRecipes(term, selectedCategory);
  };

  // select input for categories

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    filterRecipes(searchTerm, category);
  };

  const filterRecipes = (term, category) => {
    const filtered = allRecipes.filter((recipe) => {
      const matchesSearch = recipe.title
        .toLowerCase()
        .includes(term.toLowerCase());
      const matchesCategory = category
        ? recipe.categories && recipe.categories.includes(category)
        : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredRecipes(filtered);
  };

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  useEffect(() => {
    filterRecipes(initialSearchTerm, selectedCategory);
  }, [allRecipes, initialSearchTerm]);

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

  return (
    <main id={styles.browseMain}>
      <section className={styles.filterSection}>
        <img src={img1} alt="" className={styles.browseImg1} />
        <div className={styles.skew}>
          <div className={styles.searchBox}>
            <h1>Parcourir les recettes</h1>
            <div className={styles.searchBar}>
              <input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className={styles.categoryFilter}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <img src={img2} alt="" className={styles.browseImg2} />
      </section>
      <section className={styles.recipesSection}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <a href={`/recipes/${recipe._id}`} key={recipe._id}>
              <article
                className={styles.recipeCard}
                style={{ backgroundImage: `url(${recipe.imageUrl})` }}
              >
                <div className={styles.overlay}>
                  <span className={styles.cardTitle}>{recipe.title}</span>
                  <p className={styles.cardCategory}>
                    {Array.isArray(recipe.categories)
                      ? recipe.categories.join(", ")
                      : recipe.categories || "Aucune catégorie"}
                  </p>
                  <p className={styles.cardDescription}>{recipe.description}</p>
                  {userProfiles[recipe.createdBy] ? (
                    <div className={styles.cardUserContainer}>
                      <img
                        src={userProfiles[recipe.createdBy].imageUrl}
                        alt=""
                      />
                      <p className={styles.cardCreator}>
                        {userProfiles[recipe.createdBy].name}
                      </p>
                    </div>
                  ) : (
                    <p className={styles.cardCreator}>Auteur inconnu</p>
                  )}
                </div>
              </article>
            </a>
          ))
        ) : (
          <p>Aucune recette trouvée.</p>
        )}
      </section>
    </main>
  );
}

export default Browse;
