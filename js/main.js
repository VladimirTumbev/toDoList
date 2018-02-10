//  List all projects in the 1st tab panel
$(function() {
    var generateProjectsList = (function() {
        var getProjects = dataBase.getAllProjects();

        var generate = function() {
            var $projectPanel = $('#panel1');
            $projectPanel.empty();
            getProjects.forEach(function(project) {
                var $myTab = $('<div>').addClass('tab-item');
                var $wrappingLabel = $('<label>').addClass('projectNameLabel').attr('data-project', project);
                $('<span>').appendTo($wrappingLabel).html(project);
                var $myLabel = $('<label>').addClass("radio-button-container");
                $('<input>').attr('type', 'radio').attr('name', 'projectButtons').appendTo($myLabel)
                $('<span>').addClass('radiobutton').appendTo($myLabel)
                $myLabel.appendTo($wrappingLabel);
                $wrappingLabel.appendTo($myTab);
                $myTab.appendTo($projectPanel);
            });
        };

        return generate();

    });
    generateProjectsList();

    var addProjectfunc = (function() {
        // Show / hide field to add new Project 
        $('.createNewProject>*').on('click', function() {
            $(this).closest('div.newProjectContainer').find('div.addNewProject').toggleClass('hidden');
        });

        //  Send added projects to local storage
        $('#AddProjectBtn').on('click', function() {
            var inputText = $('#txtName').val() || 'No Project Name';
            dataBase.addProject(inputText);
            var inputText = $('#txtName').val('');
            generateProjectsList();
            displayByProject.init();
        });

        $('#txtName').on('keyup', function(e) {
            if (e.keyCode === 13) {
                var inputText = $('#txtName').val() || 'No Project Name';
                dataBase.addProject(inputText);
                var inputText = $('#txtName').val('');
                generateProjectsList();
                displayByProject.init();
            }
        });
    }());

    var setCompletedTask = (function() {
        $(document).on('click', '.check-box-container', function() {
            var currentProject = $('div.tasks-content').find('h4').text();
            var currentTaskId = $(this).parent().find('span[data-task-id]').attr('data-task-id');
            var theCheckBox = $(this).find('input[type="checkbox"]');

            if (theCheckBox.is(':checked')) {
                dataBase.setTaskStatement(currentProject, currentTaskId, true);
                $(this).parent().addClass('complated');
            } else {
                dataBase.setTaskStatement(currentProject, currentTaskId, false);
                $(this).parent().removeClass('complated');
            }

            displayByProject.init();
        });
    }());

    var displayTasks = (function() {
        var completedVsTotalTasks = function(project) {
            var counter = 0;
            var tasks = dataBase.getTasksByProject(project);

            tasks.forEach(function(obj) {
                if (obj.statement) {
                    counter++;
                }
            });

            return `${counter}/${tasks.length || 0}`
        };

        var getTaskNames = function(project) {
            var taskNames = {};
            var tasks = dataBase.getTasksByProject(project);

            tasks.forEach(function(obj) {
                taskNames[obj.id] = obj.title;

            });
            return taskNames;
        };

        var render = function(project) {
            var $divTaskContent = $('div.tasks-content');
            var taskNames = getTaskNames(project);
            $divTaskContent.empty();

            var $projectTitle = $('<h4>').addClass('project-title').text(project);
            $projectTitle.appendTo($divTaskContent);
            var $spanStatus = $('<span>').addClass('project-tasks-status').html(completedVsTotalTasks(project));
            $spanStatus.appendTo($divTaskContent);
            for (var id in taskNames) {
                var $taskBoxDiv = $('<div>').addClass('task-box');
                var $checkBoxLabel = $('<label>').addClass('check-box-container');
                $('<input>').attr('type', 'checkbox').appendTo($checkBoxLabel);
                $('<span>').addClass('checkmark').appendTo($checkBoxLabel);
                $checkBoxLabel.appendTo($taskBoxDiv);

                $('<p>').text(taskNames[id]).appendTo($taskBoxDiv);
                var $moreInfoSpan = $('<span>').text('more info');
                $moreInfoSpan.attr('data-task-project', project).attr('data-task-id', id).addClass('pop-up-open').attr('data-target', '#taskInformationPopUp').appendTo($taskBoxDiv);
                $taskBoxDiv.appendTo($divTaskContent);
            }

        };

        return {
            render: render,
            completedVsTotalTasks: completedVsTotalTasks,
            getTaskNames: getTaskNames
        };
    })();

    var clearAddTaskPopUp = (function () {
        var thePopUp = $('#addTaskPopUpNav');

        var clearAll = function () {
            thePopUp.find('input[type="text"]').val('');
            thePopUp.find('textarea').val('');
            thePopUp.find('.warning-text').addClass('hidden');
        };

        return clearAll;
    })();

    var taskToAdd = {
        comments: [],
        init: function() {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.$name = $('#new-task-name');
            this.$projects = $('.add-task-projects-list .value-of-select');
            this.$priority = $('#priority');
            this.$dueDate = $('#due-date');
            this.$reminder = $('#reminder');
            this.$description = $('#description');
            this.$newComment = $('#comment');
            this.$createButton = $('#createTask');
            this.$saveCommentBtn = $('#saveComment');
            this.$commentsSection = $('#commentsSection')
        },
        bindEvents: function() {
            this.$createButton.on('click', this.validateAndCreate.bind(this));
            this.$saveCommentBtn.on('click', this.addCommentAndRender.bind(this));
            this.$name.on('blur', this.validatorFunction);
            this.$description.on('blur', this.validatorFunction);
            this.$projects.on('blur', this.validatorFunction);
        },
        validatorFunction: function() {
            var value = $(this).val();
            var alreadyWarned = !($($(this).parent()).find('p').length);
            if (!(value)) {
                if (alreadyWarned) {
                    $warningParagraph = $('<p>').addClass('warning-text').text(`${$(this).attr('data-name')} cannot be empty`);
                    $warningParagraph.appendTo($(this).parent());
                }
            } else {
                $($(this).parent()).find('p').remove();
            }
        },
        getValues: function() {
            return {
                taskName: this.$name.val() || 'N/A',
                projects: this.$projects.text().split(', ') || 'N/A',
                priority: this.$priority.text() || 'Priority 1',
                dueDate: this.$dueDate.val(),
                description: this.$description.val() || 'N/A',
                reminder: this.$reminder.val(),
                newComment: this.$newComment.val() || '',
            }
        },
        addCommentAndRender: function() {
            this.addComment();
            this.renderCommens();
        },
        addComment: function() {
            var values = this.getValues();
            var now = new Date();
            now = now.toUTCString();
            var currentComment = {};
            currentComment[values.newComment] = now;
            this.comments.push(currentComment);
            this.$newComment.val('');
        },
        renderCommens: function() {
            $commentsSection = this.$commentsSection;
            $commentsSection.empty();
            this.comments.forEach(function(e) {
                var $comment = $('<div>').addClass('comment');
                var $commentDesc = $('<div>').addClass('comment-desc');
                var $commentCreator = $('<div>').addClass('comment-creator');
                var $commentCreatorName = $('<span>').addClass('comment-creator-name').text('Iron Man'); //To Do - eventually this will get the logged user
                var $avatarImg = $('<img>').addClass('avatar-small').attr('src', 'assets/images/profile.png'); // To Do - eventually this will get the logged user's profile pic
                var $commentContainer = $('<div>').addClass('comment-container');
                var $currentComment = $('<div>').addClass('current-comment');
                var $paragraphWithComment = $('<p>').text(Object.keys(e)[0]);
                var $commentDateTime = $('<p>').addClass('comment-date-time').text(Object.values(e)[0]);

                //append most inner children to their parents
                $paragraphWithComment.appendTo($currentComment);
                $currentComment.appendTo($commentContainer);
                //append inner parents to their parents
                $commentCreatorName.appendTo($commentCreator);
                $commentCreator.appendTo($commentDesc);
                $avatarImg.appendTo($commentDesc);
                $commentContainer.appendTo($commentDesc);
                //append to the biggest parent to be dynamically created
                $commentDesc.appendTo($comment);
                $commentDateTime.appendTo($comment);
                //append that parent to the existing div on the page
                $comment.appendTo($commentsSection);

            });

        },
        validateData: function() {
            var MIN_LENGTH = 1;
            var MAX_LENGTH_OTHERS = 100;
            var values = this.getValues();

            var LENGTH_CONDITION = function(value) {
                return (value.length > MIN_LENGTH && value.length < MAX_LENGTH_OTHERS)
            };

            for (var value in values) {
                if (value === 'taskName' || value === 'description') {
                    var isValid = LENGTH_CONDITION(values[value]);

                    if (isValid === false) {
                        return false;
                    }

                }
            }
            return true;
        },
        validateAndCreate: function() {
            var values = this.getValues();
            if (this.validateData()) {
                // Build task object and add it to databse
                var newTask = new Task(values.taskName, values.projects, values.priority, values.dueDate, values.reminder, values.description, this.comments, false);
                debugger;
                dataBase.addTask(newTask);

                // Close the PopUp
                $('#addTaskPopUpNav').removeClass('show');
                clearAddTaskPopUp();

                // Render the tasks
                displayTasks.render(currentProject.getProject());
            } else {
                alert('Invalid new todo');
            }
        }
    };
    taskToAdd.init();

    var popUpInformation = (function () {

        var renderTask = function (project, id) {
            var $thePopUpBox = $('#taskInformationPopUp');
            var dataOfTask = dataBase.getTaskById(project, id);

            // Fill the input
            $thePopUpBox.find('.new-task-name').val(dataOfTask['title']);
            $thePopUpBox.find('.value-of-select').text(dataOfTask['priority']);
            $thePopUpBox.find('.due-date').val(dataOfTask['dueData']);
            $thePopUpBox.find('.reminder').val(dataOfTask['reminder']);
            $thePopUpBox.find('.description').val(dataOfTask['description']);
        };

        return {
            renderTask: renderTask
        }
    })();

    var displayByProject = {

        init: function() {
            this.elementSelector();
            this.eventBinding();
        },
        elementSelector: function() {
            this.$currentProjects = $('#panel1').find(".projectNameLabel");

        },
        eventBinding: function() {
            $(this.$currentProjects).on('click', function() {
                var projectName = $(this).data('project');

                currentProject.setProject(projectName);
                displayTasks.completedVsTotalTasks(projectName);
                displayTasks.getTaskNames(projectName);
                displayTasks.render(projectName);
            });
        }
    };
    displayByProject.init();

    // Open popUp with 'more information'
    $(document).on('click', '.task-box span.pop-up-open', function () {
        var taskProject = $(this).data('task-project');
        var taskid = $(this).data('task-id');

        popUpInformation.renderTask(taskProject,taskid);
    });

    // Open PopUp 'addTask' and render all tasks in the dropdwon
    $(document).on('click', '.pop-up-open.add-task', function () {
        var allProjects = dataBase.getAllProjects();
        var $theDropDownList = $('.add-task-projects-list .dropdown-content');

        $theDropDownList.empty();
        allProjects.forEach(function (value) {
            var dropDownElement = $('<a>').addClass('dropdown-item').text(value);
            dropDownElement.appendTo($theDropDownList);
        })
    });
});
