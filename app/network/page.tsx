import Header from "../../components/layout/Header"
import PersonCard from "../../components/network_page/PersonCard";
import Connections from "../../components/network_page/Connections";

export default function NetworkPage() {
  return (
    <div className="w-full overflow-hidden">
      <Header />
      <PersonCard></PersonCard>
      <Connections></Connections>
    </div>
  );
}
