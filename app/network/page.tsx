import Header from "../../components/layout/Header"
import PersonCard from "../../components/network_page/PersonCard";
import Connections from "../../components/network_page/Connections";

export default function NetworkPage() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <PersonCard />
        <Connections />
      </div>
    </div>
  );
}
