import React from 'react'
import ContactBanner from './ContactBanner'
import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'
import ContactMap from './ContactMap'

const ContactPage = () => {
  return (
    <div className="pt-24 md:pt-28">
      <ContactBanner />
      <ContactInfo />
      <ContactForm />
      <ContactMap />
    </div>
  )
}

export default ContactPage