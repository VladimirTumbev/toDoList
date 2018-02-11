var dataBase = (function () {
    var projects = {};

    var overwriteData = function () {
        localStorage.setItem("projects", JSON.stringify( projects ));
    };

    if (localStorage.getItem( "projects" )) { 
        projects = JSON.parse(localStorage.getItem( 'projects' ));
    } else {
        overwriteData();
    }

    var checkObjectOfTask = function (object) {
        for (var property in object) {
            if (typeof property === 'undefined') {
                break;
                return false;
            }
        }

        return true;
    };

    var addProject = function(project) {
        if (typeof projects[project] === 'undefined') {
            projects[project] = [];
            overwriteData();
        } else {
            return 'The"' + project + '" already exist';
        }
    };

    var removeProject = function (project) {
        if (typeof projects[project] === 'undefined') {
            return 'The project doesn\'t exist '
        }

        delete projects[project];
        overwriteData();
        return true;
    };

    var addTask = function ( object ) {
        if (!checkObjectOfTask(object)) {
            return 'Something went wrong!'
        }

        // Add task to Data Base
        for (var i = 0; i < object['project'].length; i+=1) {
            var theProject = object['project'][ i ];

            // Check weather theProject is empty object
            if (typeof projects[theProject] === 'undefined') {
                return 'This project doesn\'t exist';
                // projects[theProject] = [];
            }

            object.id =  ( projects[theProject].length + 1 );
            projects[ theProject ].push( object );
        }

        overwriteData();
        return true;
    };

    var clearAll = function () {
        projects = {};
        overwriteData();
    };

    var deleteTask = function (project, id) {
        if (typeof projects[project] === 'undefined') {
            return 'There is no "' + project + '" project';
        }
        projects[project][id - 1].deleted = true;
        // projects[project].splice((id -1), id);
        overwriteData();
    };

    var getAllProjects = function () {
        return Object.keys(projects)
    };

    var getTasksByProject = function (project) {
        var result = [];
        for (var i = 0; i < projects[project].length; i+=1) {
            if (projects[project][i].statement === false && projects[project][i].deleted !== true) {
                result.push(projects[project][i]);
            }
        }

        return result;
    };

    var getComplatedTasksByProject = function (project) {
        var result = [];
        for (var i = 0; i < projects[project].length; i+=1) {
            if (projects[project][i].statement === true && projects[project][i].deleted !== true) {
                result.push(projects[project][i]);
            }
        }

        return result;
    };

    var getTaskById = function (project, id) {
        return projects[project][id -1];
    };

    var setTaskStatement = function (project, id, statement) {
        projects[project][id -1].statement = statement;
        overwriteData();

        return true;
    };

    var editTask = function (project, id, object) {
        if (!checkObjectOfTask(object)) {
            return 'Something went wrong!'
        }

        projects[project][id- 1] = object;
        overwriteData();
    };

    return {
        addTask: addTask,
        editTask: editTask,
        deleteTask: deleteTask,
        getTaskById: getTaskById,
        getTasksByProject: getTasksByProject,
        setTaskStatement: setTaskStatement,
        addProject: addProject,
        getAllProjects: getAllProjects,
        clearAll: clearAll,
        removeProject: removeProject,
        getComplatedTasksByProject: getComplatedTasksByProject
    }
})();

var currentProject = (function () {
    var currentProject = '';

    var overwriteData = function () {
        localStorage.setItem('currentProject', JSON.stringify( currentProject ));
    };

    if (localStorage.getItem( 'currentProject' )) {
        currentProject = JSON.parse(localStorage.getItem( 'currentProject' ));
    } else {
        overwriteData();
    }

    var setProject = function (project) {
        currentProject = project;
        overwriteData();
    };

    var getProject = function () {
        return currentProject;
    };

    return {
        setProject: setProject,
        getProject: getProject
    }

})();

function Task (title, project, priority, dueData, reminder, description, comments, statement) {
    this.id = null;
    this.title = title;
    this.project = project;
    this.priority = priority;
    this.dueData = dueData;
    this.reminder = reminder;
    this.description = description;
    this.comments = comments;
    this.statement = statement;
    this.deleted = false;
}
