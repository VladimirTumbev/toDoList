var dataBase = (function () {
    var projects = {};

    var overwriteData = function () {
        localStorage.setItem("projects", JSON.stringify( projects ));
    };

    if (!localStorage.getItem( "projects" )) {
        overwriteData();
    } else {
        projects = JSON.parse(localStorage.getItem( 'projects' ));
    }

    var checkObjectOfTask = function (object) {
        for (var property in object) {
            if (typeof property === 'undefined') {
                break;
                return false;
            }
        }
    };

    var addTask = function ( object ) {
        if (!checkObjectOfTask()) {
            return 'Something went wrong!'
        }

        // Add task to Data Base
        for (var i = 0; i < object['project'].length; i+=1) {
            var theProject = object['project'][ i ];

            // Check weather theProject is empty object
            if (typeof projects[theProject] === 'undefined') {
                projects[theProject] = [];
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

    var getTaskById = function (project, id) {
        return projects[project][id -1];
    };

    var setTaskStatement = function (project, id, statement) {
        projects[project][id -1].statement = statement;
        overwriteData();

        return true;
    };

    var editTask = function (project, id, object) {
        if (!checkObjectOfTask()) {
            return 'Something went wrong!'
        }

        projects[project][id- 1] = object;
    };

    return {
        addTask: addTask,
        clearAll: clearAll,
        deleteTask: deleteTask,
        getAllProjects: getAllProjects,
        getTasksByProject: getTasksByProject,
        getTaskById: getTaskById,
        setTaskStatement: setTaskStatement,
        editTask: editTask,
    }
})();

// function Task (title, project, priority, dueData, reminder, description, comments, statement) {
//     this.id = null;
//     this.title = title;
//     this.project = project;
//     this.priority = priority;
//     this.dueData = dueData;
//     this.reminder = reminder;
//     this.description = description;
//     this.comments = comments;
//     this.statement = statement;
//     this.deleted = false;
// }
// var createToDo = function(taskName, projects, dueDate, reminder, description, comments) {
//
//     return {
//         taskName: taskName,
//         projects: projects,
//         dueDate : dueDate,
//         reminder: reminder,
//         description: description,
//         comments: comments
//     };
//
// };