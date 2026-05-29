const Metadata = require('../models/Metadata');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Get All Portfolio Metadata (Public)
exports.getMetadata = async (req, res) => {
  try {
    let metadata = await Metadata.findOne();
    if (!metadata) {
      // Seed default parsed resume credentials if none exists
      metadata = new Metadata({
        name: 'Rahul',
        title: 'Full-Stack Developer',
        contact: {
          email: 'rahulx0568@gmail.com',
          phone: '+91 6230271530',
          location: 'Mandi (H.P)',
          linkedin: 'https://www.linkedin.com/in/rahul-93aba3301'
        },
        education: [
          {
            institution: 'ABVGIET Pragatinagar, Shimla',
            degree: 'B.Tech - Computer Science and Engineering',
            period: '2022 – 2026',
            location: 'Shimla, Himachal Pradesh'
          },
          {
            institution: 'Govt. Sr. Sec. School, Pandoh',
            degree: 'Higher Secondary (Class XII) – HP Board',
            period: '2021–2022',
            location: 'Pandoh, Himachal Pradesh'
          }
        ],
        experience: [
          {
            role: 'MERN Stack Intern',
            company: 'Novem Control',
            period: '2024',
            details: [
              'Completed a 4-week hands-on internship program on the MERN Stack.',
              'Built full-stack web applications using HTML, CSS, Javascript and React.js'
            ]
          },
          {
            role: 'Full Stack Developer Intern',
            company: 'Wegile Infotech',
            period: 'Jan 2026',
            details: [
              'Completed a 6-month full stack development internship working on React.js, Next.js, Node.js, and MongoDB.',
              'Contributed to frontend UI development, backend API integration, debugging, and real-time collaborative features.'
            ]
          }
        ],
        skills: [
          {
            category: 'Programming Languages',
            skills: ['Java', 'JavaScript', 'Python', 'C++']
          },
          {
            category: 'Frontend Development',
            skills: ['HTML', 'CSS', 'JavaScript', 'React.js', 'Next.js', 'Tailwind CSS']
          },
          {
            category: 'Backend Development',
            skills: ['Node.js', 'Express.js', 'REST APIs', 'JWT Authentication']
          },
          {
            category: 'Databases',
            skills: ['MongoDB', 'PostgreSQL', 'SQL']
          },
          {
            category: 'Tools & Platforms',
            skills: ['Git', 'Postman', 'Render', 'Vercel', 'VS Code', 'IntelliJ IDEA']
          }
        ],
        certifications: [
          {
            name: 'MERN Stack Training (4 Weeks)',
            issuer: 'Novem Control'
          },
          {
            name: 'Workshop on Space Exploration Technology',
            issuer: 'ISRO IIRS, Dehradun'
          }
        ]
      });
      await metadata.save();
    }
    res.json(metadata);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update Portfolio Metadata (Admin Only)
exports.updateMetadata = async (req, res) => {
  try {
    let metadata = await Metadata.findOne();
    if (!metadata) {
      metadata = new Metadata(req.body);
    } else {
      // Update fields
      Object.assign(metadata, req.body);
    }
    await metadata.save();
    res.json(metadata);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Upload and Parse Resume PDF (Admin Only)
exports.uploadAndParseResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ msg: 'Please upload a PDF file.' });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const parsedData = await pdf(dataBuffer);

    // Save PDF permanently in public assets of client/server
    const targetDir = path.join(__dirname, '../public');
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const publicPath = path.join(targetDir, 'RAHUL_Resume.pdf');
    fs.copyFileSync(req.file.path, publicPath);

    // Clean temp uploaded file
    fs.unlinkSync(req.file.path);

    // Extract dynamic lines for log validation
    const lines = parsedData.text.split('\n').filter(l => l.trim().length > 0);
    console.log(`[RESUME UPLOADED] Handoff parsing successfully complete! Total lines parsed: ${lines.length}`);

    // Update Metadata with parsed data placeholder if custom parsing needed
    let metadata = await Metadata.findOne();
    if (!metadata) {
      metadata = new Metadata();
    }
    
    // Return extracted parsed text so admin can audit or review
    res.json({
      msg: 'Resume PDF uploaded, permanently stored as RAHUL_Resume.pdf, and parsed successfully!',
      text: parsedData.text,
      metadata
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
