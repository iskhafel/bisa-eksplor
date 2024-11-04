import Promo from "../../../components/Fragments/Promo";
import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { useContext } from "react";
import CustomFooter from "../../../components/CustomFooter";

export default function PromoPage() {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-slate-800 text-white">
      <Header user={user} />
      <Promo />
      <CustomFooter />
    </div>
  );
}
