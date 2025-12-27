import React from 'react'
import WhoWeAre from './WhoWeAre'
import QualitySafety from './QualitySafety'
import MissionVision from './MissionVision'
import CustomerTrust from './CustomerTrust'
import AboutBanner from './AboutBanner'
import AboutTestimonial from './AboutTestimonial'

const Aboutpage = () => {
  return (
    <div className="pt-24 md:pt-28">
      <AboutBanner />
      <WhoWeAre />
      <QualitySafety />
      <MissionVision />
      <CustomerTrust />
      <AboutTestimonial />
    </div>
  )
}

export default Aboutpage