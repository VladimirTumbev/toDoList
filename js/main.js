//  List all projects in the 1st tab panel
$(function () {
    var generateProjectsList = (function () {

        var projectsList = dataBase.getAllProjects();

        var generate = function () {
            var $projectPanel = $('#panel1');
            $(projectsList).each(function (_, project) {

                var $myTab = $('<div>').addClass('tab-item')
                $('<span>').appendTo($myTab).html(project);
                var $myLabel = $('<label>').addClass("check-box-container");
                $('<input>').attr('type', 'checkbox').appendTo($myLabel)
                $('<span>').addClass('checkmark').appendTo($myLabel)
                $myLabel.appendTo($myTab)
                $myTab.appendTo($projectPanel);
            });
        };

        return generate();
    }());

    var taskToAdd = {
        comments: [],
        init: function () {
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function () {
            this.$name = $('#new-task-name');
            this.$projects = $('#add-to-project');
            this.$priority = $('#priority');
            this.$dueDate = $('#due-date');
            this.$reminder = $('#reminder');
            this.$description = $('#description');
            this.$newComment = $('#comment');
            this.$createButton = $('#createTask');
            this.$saveCommentBtn = $('#saveComment');
            this.$commentsSection = $('#commentsSection')
        },

        bindEvents: function () {
            this.$createButton.on('click', this.validateAndCreate.bind(this));
            this.$saveCommentBtn.on('click', this.addCommentAndRender.bind(this));
            this.$name.on('blur', this.validatorFunction);
            this.$description.on('blur', this.validatorFunction);
            this.$projects.on('blur', this.validatorFunction);
        },

        validatorFunction: function () {
            var value = $(this).val()
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

        getValues: function () {
            return {
                taskName: this.$name.val() || 'N/A',
                projects: this.$projects.val().split(', ') || 'N/A',
                priority: this.$priority.val() || 1,
                dueDate: this.$dueDate.val(),
                description: this.$description.val() || 'N/A',
                reminder: this.$reminder.val(),
                newComment: this.$newComment.val() || '',
            }
        },

        addCommentAndRender: function () {
            this.addComment();
            this.renderCommens();
        },

        addComment: function () {
            var values = this.getValues();
            var now = new Date();
            now = now.toUTCString();
            var currentComment = {};
            currentComment[values.newComment] = now;
            this.comments.push(currentComment);
            this.$newComment.val('');
        },

        renderCommens: function () {
            $commentsSection = this.$commentsSection;
            $commentsSection.empty();
            this.comments.forEach(function (e) {
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

        validateData: function () {
            var MIN_LENGTH = 1;
            var MAX_LENGTH_COMMENTS = 150;
            var MAX_LENGTH_OTHERS = 100;
            var values = this.getValues();

            var LENGTH_CONDITION = function (value) {
                return (value.length > MIN_LENGTH && value.length < MAX_LENGTH_OTHERS)
            }

            for (const value in values) {
                if (value === 'taskName' || value === 'description') {
                    var isValid = LENGTH_CONDITION(values[value]);
                    if (isValid === false) {
                        console.log(value);
                        console.log(values[value]);
                        return false;
                    }
                }
            }
            return true;
        },

        validateAndCreate: function () {
            var values = this.getValues();
            if (this.validateData()) {
                var newTask = new Task(values.taskName, values.projects, values.priority, values.dueDate, values.reminder, values.description, this.comments, false);
                dataBase.addTask(newTask);
                $('#addTaskPopUpNav').removeClass('show');
            } else {
                alert('Invalid new todo');
            }
        }
    };
    taskToAdd.init();

});

$(function () {
    var displayTasks = (function () {
        var completedVsTotalTasks = function (project) {
            var counter = 0;
            var tasks = dataBase.getTasksByProject(project);

            tasks.forEach(function (obj) {
                if (obj.statement) {
                    counter++;
                }
            });

            return `${counter}/${tasks.length}`
        }

        var getTaskNames = function (project) {
            var taskNames = {};
            var tasks = dataBase.getTasksByProject(project);

            tasks.forEach(function (obj) {
                taskNames[obj.id] = obj.title;

            });
            return taskNames;
        }

        var render = function (project) {
            var $divTaskContent = $('div.tasks-content');
            var taskNames = getTaskNames(project);
            $('.tasks-content').empty();
            var $projectTitle = $('<h4>').addClass('project-title').text(project);
            $projectTitle.appendTo($divTaskContent);
            var $spanStatus = $('<span>').addClass('project-tasks-status').html(completedVsTotalTasks(project));
            $spanStatus.appendTo($divTaskContent);
            for (const id in taskNames) {
                var $taskBoxDiv = $('<div>').addClass('task-box');
                var $checkBoxLabel = $('<label>').addClass('check-box-container');
                $('<input>').attr('type', 'checkbox').appendTo($checkBoxLabel);
                $('<span>').addClass('checkmark').appendTo($checkBoxLabel);
                $checkBoxLabel.appendTo($taskBoxDiv);
                $('<p>').text(taskNames[id]).appendTo($taskBoxDiv);
                var $moreInfoSpan = $('<span>').text('more info');
                $moreInfoSpan.attr('data-task-project', project);
                $moreInfoSpan.attr('data-task-id', id);
                $moreInfoSpan.appendTo($taskBoxDiv);
                $taskBoxDiv.appendTo($divTaskContent);
            }


        };

        return {
            render,
            completedVsTotalTasks,
            getTaskNames
        };
    })();
    displayTasks.render('shopping');
});


/*
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
*/