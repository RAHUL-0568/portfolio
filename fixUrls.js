const fs = require('fs');
const files = [
  'client/src/components/AdminDashboard.jsx',
  'client/src/components/Contact.jsx',
  'client/src/components/Hero.jsx',
  'client/src/components/Projects.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Replace `http://${window.location.hostname}:5000` with `${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}`
  content = content.replace(/http:\/\/\$\{window\.location\.hostname\}:5000/g, "${import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`}");
  fs.writeFileSync(file, content);
});
console.log('URLs replaced successfully.');
