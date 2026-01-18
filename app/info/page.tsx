'use client';

import { motion } from 'framer-motion';
import StaticHeader from "../../components/layout/StaticHeader"
import Information from "../../components/info_page/Information"
import Footer from "../../components/layout/Footer";

export default function InfoPage() {
  return (
    <motion.div 
      className="w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <StaticHeader />
      <Information />
      <Footer></Footer>
    </motion.div>
  );
}
