var sys = require('sys');
var fs = require('fs');
var exec = require('child_process').exec
, spawn = require('child_process').spawn
, events = require('events')
, child;

var colors = require('./lib/colors');

// named events and broodmother event dispatcher
var kohai = new events.EventEmitter();

kohai.addListener('clone', function(project){
  sys.puts('## clone() ##'.yellow);
  exports.clone(project);
});

kohai.addListener('touch', function(project){
  sys.puts('## touch()  ##'.green);
  exports.touch(project);
});

kohai.addListener('commit', function(project){
  sys.puts('## commit() ##'.blue);
  exports.commit(project);
});

//sys.puts(JSON.stringify(projects));

exports.checkIn = function(projects){
  
  sys.puts('senpai, all projects are in order!');

  // read in projects.json
  var projects = fs.readFileSync('./projects.json', encoding='utf8');

  try{
    projects = JSON.parse(projects);
  }
  catch(err){
    sys.puts('many apologies '.red+'senpai'.yellow+', but the '.red.bold+'projects.json'.green.underline+' file is not valid json. '.red+'master crockford'.yellow+' disapproves.'.red.bold)
  }

  kohai.emit('clone', gitPath);
  
};

exports.clone = function(gitPath){
  

    var dir = __dirname;
    var appDir = dir + '/appSpace/';
    sys.puts('Attempting to clone repo @ ' + gitPath);
    sys.puts(appDir, gitPath);
    var downloadCommand = 'cd ' + appDir + ' && git clone ' + gitPath;
    // Remark: Using 'exec' here because chaining 'spawn' is a PIMFA
    gitClone = exec(downloadCommand, function (error, stdout, stderr) {
      if (error !== null) {
        sys.puts('Failed to clone repo @ ' + gitPath + ' to ' + appDir + ': ' + error);
      }
      else{
        kohai.emit('touch');
      }
    });
  
};

exports.touch = function(projectPath){
  kohai.emit('commit');
  return projectPath;  
};

exports.commit = function(projectPath){
  kohai.emit('complete');
  return projectPath;  
};

exports.complete = function(projectPath){
  return 'complete';
};

exports.checkIn();
