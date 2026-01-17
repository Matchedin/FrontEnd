import StaticHeader from "../../components/layout/StaticHeader"
import Information from "../../components/info_page/Information"

export default function InfoPage() {
  return (
    <div className="w-full overflow-hidden">
      <StaticHeader />
      <Information />
    </div>
  );
}
