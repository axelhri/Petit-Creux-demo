import { Outlet, useNavigation } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function SharedLayout() {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  return (
    <div>
      <Navbar />
      {isPageLoading ? <div>Loading...</div> : <Outlet />}
      <Footer />
    </div>
  );
}
export default SharedLayout;
