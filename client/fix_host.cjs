const fs = require('fs');
const path = require('path');
const files = [
  'src/App.jsx',
  'src/components/AdminDashboard.jsx',
  'src/components/Contact.jsx',
  'src/components/Hero.jsx',
  'src/components/Projects.jsx'
];

files.forEach(f => {
  let p = path.join('C:/Users/Mehak/OneDrive/Desktop/portfolio-main/portfolio-main/client', f);
  let content = fs.readFileSync(p, 'utf-8');
  content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`http://${window.location.hostname}:5000$1`');
  content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`http://${window.location.hostname}:5000$1`');
  content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`http://${window.location.hostname}:5000$1`');
  fs.writeFileSync(p, content);
  console.log('Updated ' + f);
});
