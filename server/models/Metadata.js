const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  period: { type: String, required: true },
  details: { type: [String], default: [] }
});

const EducationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  period: { type: String, required: true },
  location: { type: String, default: '' }
});

const SkillCategorySchema = new mongoose.Schema({
  category: { type: String, required: true }, // e.g. "Programming Languages"
  skills: { type: [String], default: [] }
});

// Enhanced certification schema with additional fields
const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  link: { type: String, default: '' },
  date: { type: String, default: '' },         // e.g. "June 2024"
  credentialId: { type: String, default: '' }, // Credential ID from issuer
  category: { type: String, default: '' },     // e.g. "Cloud", "Frontend", "AI"
  badge: { type: String, default: '' }         // Badge image URL (optional)
});

// Detailed skill schema with proficiency, description, project link
const DetailedSkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: '' },     // e.g. "Frontend", "Backend"
  proficiency: { type: Number, default: 50, min: 0, max: 100 }, // 0-100
  description: { type: String, default: '' },  // Short description
  projectName: { type: String, default: '' },  // Name of a project using this skill
  projectLink: { type: String, default: '' },  // URL to that project
  icon: { type: String, default: '' }          // Emoji or short icon text
});

// Testimonial schema
const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  quote: { type: String, required: true },
  avatar: { type: String, default: '' }, // Avatar image URL (optional)
  rating: { type: Number, default: 5, min: 1, max: 5 }
});

const MetadataSchema = new mongoose.Schema({
  name: { type: String, default: 'Rahul' },
  title: { type: String, default: 'Full-Stack Developer' },
  bio: { type: String, default: '' },
  availability: { type: String, default: 'Open to opportunities' },
  heroText: { type: String, default: 'Crafting intelligent interfaces and scalable systems.' },
  contact: {
    email: { type: String, default: 'rahulx0568@gmail.com' },
    phone: { type: String, default: '+91 6230271530' },
    location: { type: String, default: 'Mandi (H.P)' },
    linkedin: { type: String, default: 'https://www.linkedin.com/in/rahul-93aba3301' }
  },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  skills: [SkillCategorySchema],
  certifications: [CertificationSchema],
  detailedSkills: [DetailedSkillSchema],
  testimonials: [TestimonialSchema]
}, { timestamps: true });

module.exports = mongoose.model('Metadata', MetadataSchema);
