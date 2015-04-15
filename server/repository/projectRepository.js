var mongoose = require('mongoose');

Project = mongoose.model('Project');

exports.create = function (project, cb) {
    var newProject = new Project ({
        name: project.name,
        description: project.description,
        leader: project.leader,
        startDate: project.startDate,
        deadline: project.deadline,
        standardStates: project.standardStates
    });
    newProject.save(cb);
};

exports.addCollab = function(projectId, users, cb) {
    Project.findOne({_id : projectId}).lean().exec(function(err, project) {
        console.log(project);
        console.log(users);
        project.collaborators = users;
        Project.findOneAndUpdate({_id : project._id}, project, {new : true}).lean().exec(cb);
    });
};