import mongoose from 'mongoose';

const ContactSettingsSchema = new mongoose.Schema({
  pageTitle: { type: String, default: 'Contact' },
  breadcrumbHome: { type: String, default: 'Home' },
  breadcrumbCurrent: { type: String, default: 'Contact' },
  mapUrl: { type: String, default: 'https://www.google.com/maps/embed/...' },
  formHeading: { type: String, default: 'Have a question or comment?' },
  formSubheading: { type: String, default: 'Use the form below...' },
  labelName: { type: String, default: 'Name' },
  labelPhone: { type: String, default: 'Phone Number' },
  labelEmail: { type: String, default: 'Email' },
  labelComment: { type: String, default: 'Comment' },
  buttonText: { type: String, default: 'Submit Contact' },
  infoHeading: { type: String, default: "Get In Touch!" },
  infoDescription: { type: String, default: "We'd love to hear from you..." },
  phoneText: { type: String, default: 'Call: +1 (516) 574-1871' },
  emailText: { type: String, default: 'vikingarmoryblades@gmail.com' },
  addressText: { type: String, default: '160 Madison Ave Freeport 11520 New York' },
  hoursHeading: { type: String, default: 'Opening Hours:' },
  hoursMonSat: { type: String, default: 'MON to SAT: 10:00-17:00' },
  hoursSun: { type: String, default: 'SUN: 10:00-17:00' },
}, { timestamps: true });

// This prevents Mongoose from creating the model multiple times on hot-reload
export default mongoose.models.ContactSettings || mongoose.model('ContactSettings', ContactSettingsSchema);