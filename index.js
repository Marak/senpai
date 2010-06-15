var sys = require('sys');
var fs = require('fs');
var exec = require('child_process').exec
, spawn = require('child_process').spawn
, events = require('events')
, child;

var colors = require('./lib/colors');

var gits = [];

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

kohai.addListener('complete', function(project){
  sys.puts('## complete() ##'.grey);
  exports.complete(project);
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


  for(var project in projects){
    gits.push(projects[project].git);
  }
  gits.reverse();
  kohai.emit('clone', gits.pop());
  
};

exports.clone = function(gitPath){
    var dir = __dirname;
    var appDir = dir + '/appSpace/';
    //sys.puts('Attempting to clone repo @ ' + gitPath);
    //sys.puts(appDir, gitPath);
    var downloadCommand = 'cd ' + appDir + ' && git clone ' + gitPath;
    // Remark: Using 'exec' here because chaining 'spawn' is a PIMFA
    
    (function(gitPath){
      gitClone = exec(downloadCommand, function (error, stdout, stderr) {
        if (error !== null) {
          //sys.puts('Failed to clone repo @ ' + gitPath + ' to ' + appDir + ': ' + error);
        }
        else{
        }
        kohai.emit('touch', gitPath);
      });
    })(gitPath)
};

exports.touch = function(gitPath){
  var dir = __dirname;
  var appDir = dir + '/appSpace/';
  var g = gitPath;
  
  (function(gitPath){
    
    var x = gitPath.split('/');
    x = x[x.length-1];
    x = x.replace('.git','');
    
    
    fs.readFile(appDir + x + '/Readme.md', function (err,data) {
      if (err !== null) {
        sys.puts('error '.red + err);
      }
      else{
        //sys.puts('file got read', data.toString());
        (function(gitPath){
          
          var x = gitPath.split('/');
          x = x[x.length-1];
          x = x.replace('.git','');
          fs.writeFile(appDir + x + '/Readme.md', data.toString() + ' ', function(err) {
            if (err !== null) {
              //sys.puts(JSON.stringify(err));
            }
            else{
            }
            sys.puts("got touched!");
            kohai.emit('commit', gitPath);
          });
        })(gitPath);
      }
    });
  })(gitPath);
  
};

exports.commit = function(gitPath){
  
  var dir = __dirname;
  var appDir = dir + '/appSpace/';
  
  var x = gitPath.split('/');
  x = x[x.length-1];
  x = x.replace('.git','');
  //sys.puts('Attempting to clone repo @ ' + gitPath);
  sys.puts(appDir, gitPath);
  var commitCommand = 'cd ' + appDir + x + ' && git commit -a -m "'+x+' has been succesfully updated, tested, and deployed. kohai reporting that all is well sanpai. " && git push origin master';
  sys.puts(commitCommand);

  // Remark: Using 'exec' here because chaining 'spawn' is a PIMFA
  gitCommit = exec(commitCommand, function (error, stdout, stderr) {
    if (error !== null) {
      sys.puts('Failed to commit repo @ ' + gitPath + ' to ' + appDir + ': ' + error);
    }
    else{
      
      if(gits.length){
         kohai.emit('clone', gits.pop());
      }
      else{
        kohai.emit('complete');
      }
      
    }
   
  });
 
};

exports.complete = function(projectPath){
  sys.puts('complete');
  return 'complete';
};

exports.checkIn();
