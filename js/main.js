//  List all projects in the 1st tab panel
$(function() {
    var generateProjectsList = (function() {

        var projectsList = dataBase.getAllProjects();

        var generate = function() {
            var $projectPanel = $('#panel1');
            $(projectsList).each(function(_, project) {

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
        },
        bindEvents: function () {
            this.$createButton.on('click', this.validateAndCreate.bind(this));
            this.$saveCommentBtn.on('click', this.addComment.bind(this));
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

        addComment: function () {
            var values = this.getValues();
            this.comments.push(values.newComment);
        },

        validateData: function () {
            var MIN_LENGTH = 2;
            var MAX_LENGTH_COMMENTS = 150;
            var MAX_LENGTH_OTHERS = 100;
            var values = this.getValues();

            var LENGTH_CONDITION = function (value) {
                return (value < MIN_LENGTH && value > MAX_LENGTH_OTHERS)
            }

            for (const value in this.values) {
                if (this.values === 'dueDate' || this.values === 'reminder' || this.values === 'priority') {
                    continue;
                }
                if (!(LENGTH_CONDITION(this.values[value]))) {
                    alert('Invalid length. Length must be between 2 and 100 characters')
                    return false;
                }
            }
            return true;
        },

        validateAndCreate: function () {
            var values = this.getValues();
            if (this.validateData()) {
                var newTask = new Task(values.taskName, values.projects, values.priority, values.dueDate, values.reminder, values.description, this.comments, false);
                dataBase.addTask(newTask);
            } else {
                alert('Invalid new todo');
            }
        }
    };
    taskToAdd.init();

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
