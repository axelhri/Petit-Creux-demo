import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SharedLayout from "./layouts/SharedLayout.jsx";
import { Home, ErrorPage } from "./pages";
import SingleError from "./components/SingleError.jsx";
import Profile from "./pages/Profile.jsx";
import SingleRecipe from "./pages/SingleRecipe.jsx";
import BrowseRecipes from "./pages/Browse.jsx";
import { AuthProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SharedLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
        errorElement: <SingleError />,
      },
      {
        path: "/browse",
        element: <BrowseRecipes />,
        errorElement: <SingleError />,
      },
      {
        path: "profile/:userId",
        element: <Profile />,
        errorElement: <SingleError />,
      },
      {
        path: "recipes/:id",
        element: <SingleRecipe />,
        errorElement: <SingleError />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
