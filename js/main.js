//  List all projects in the 1st tab panel

var getProjects = dataBase.getAllProjects();
console.log (getProjects);

var generateProjectsList = function(projects) {
    
    var $projectList = $('#panel1');

    $(projects).each(function(_, project) {
        // var $project = $(project);
        // var currentTabID = "tab-" + _
        // $('<div>').addClass('tab-item').attr("id",currentTabID).appendTo($projectList);
        // console.log (project);
        // $('<span>').appendTo('#'+currentTabID).html(project);
        // var myLabel = $('<label>').addClass("check-box-container");
        // $('<input>').attr('type', 'checkbox').attr('checked', 'checked').appendTo(myLabel)
        // $('<span>').addClass('checkmark').appendTo(myLabel)
        // myLabel.appendTo('#'+currentTabID)
        var $myTab = $('<div>').addClass('tab-item')
        $('<span>').appendTo($myTab).html(project);
        var $myLabel = $('<label>').addClass("check-box-container");
        $('<input>').attr('type', 'checkbox').appendTo($myLabel)
        $('<span>').addClass('checkmark').appendTo($myLabel)
        $myLabel.appendTo($myTab)
        $myTab.appendTo($projectList);     
    });
};

generateProjectsList(getProjects)

