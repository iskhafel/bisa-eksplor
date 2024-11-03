import Header from "../components/Header";
import CustomFooter from "../components/CustomFooter";
import Banner from "../components/Fragments/Banner";
import Promo from "../components/Fragments/Promo";
import Category from "../components/Fragments/Category";
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
