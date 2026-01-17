import Image from "next/image";
import Header from "../components/layout/Header"
import Hero from "../components/layout/Hero"
import About from "../components/sections/About"
import Connect from "../components/sections/Connect"

export default function Home() {
  return (
    <>
      <Header></Header>
      <Hero></Hero>
      <About></About>
      <Connect></Connect>
    </>
  );
}
