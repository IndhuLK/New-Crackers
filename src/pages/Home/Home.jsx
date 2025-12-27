import React, { useEffect } from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import BestSellers from "./BestSellers";
import Testimonials from "./Testimonials";
import NewArrivalsPreview from "./NewArrivalsPreview";

import CollectionsByOccasion from "./CollectionsByOccasion";
import TrustBadges from "./TrustBadges";
import Newsletter from "./Newsletter";

const Home = () => {
  useEffect(() => {
    // Ensure smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-slate-50 pt-24 md:pt-28">
      <Hero />
      <Categories />
      <BestSellers />
      
      <NewArrivalsPreview />
      <CollectionsByOccasion />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
