import Header from "../components/Header";
import Banner from "../components/Banner";
import Promo from "../components/Promo";
import Category from "../components/Category";
import CustomFooter from "../components/CustomFooter";
import { UserContext } from "../context/UserContextProvider";
import { useContext } from "react";

export default function HomePage() {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-slate-800 text-white">
      <Header user={user} />
      <Banner />
      <Promo />
      <Category />
      <CustomFooter />
    </div>
  );
}
