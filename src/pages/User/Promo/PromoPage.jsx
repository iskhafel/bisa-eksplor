import Header from "../../../components/Header";
import { UserContext } from "../../../context/UserContextProvider";
import { useContext } from "react";

export default function PromoPage() {
  const { user } = useContext(UserContext);

  return (
    <>
      <Header user={user} />
    </>
  );
}
