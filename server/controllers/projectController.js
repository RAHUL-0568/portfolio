const Project = require('../models/Project');

// Get All Projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, stars: -1, createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get Featured Projects
exports.getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ stars: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a Project (Admin Only)
exports.createProject = async (req, res) => {
  const { title, description, techStack, liveLink, customBanner, featured } = req.body;

  try {
    const newProject = new Project({
      title,
      description,
      techStack,
      liveLink,
      customBanner,
      featured
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a Project (Admin Only)
exports.updateProject = async (req, res) => {
  const { title, description, techStack, liveLink, customBanner, featured } = req.body;

  try {
    let project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found.' });
    }

    project.title = title !== undefined ? title : project.title;
    project.description = description !== undefined ? description : project.description;
    project.techStack = techStack !== undefined ? techStack : project.techStack;
    project.liveLink = liveLink !== undefined ? liveLink : project.liveLink;
    project.customBanner = customBanner !== undefined ? customBanner : project.customBanner;
    project.featured = featured !== undefined ? featured : project.featured;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a Project (Admin Only)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found.' });
    }

    await project.deleteOne();
    res.json({ msg: 'Project successfully removed.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
