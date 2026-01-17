'use client';

import Image from "next/image";
import dynamic from "next/dynamic";
import Header from "../components/layout/Header"

const Hero = dynamic(() => import('../components/layout/Hero'), { ssr: false });
const About = dynamic(() => import('../components/sections/About'), { ssr: false });
const Connect = dynamic(() => import('../components/sections/Connect'), { ssr: false });

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
