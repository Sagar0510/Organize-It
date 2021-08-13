#!/usr/bin/env node
let input = process.argv.slice(2); //take input from 2nd index of cmd,excluding node and main.js
let fs = require("fs");
let path = require("path");
let types = {
  // object containing types, to identify file types
  Videos: ["mp4", "mkv", "mov", "wmv", "avi", "mpeg-2"],
  Audios: ["mp3", "m4a", "flac", "wav", "wma", "aac"],
  Images: ["jpg", "jpeg", "png", "gif"],
  Archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
  Documents: [
    "docx",
    "doc",
    "pdf",
    "xlsx",
    "xls",
    "odt",
    "ods",
    "odp",
    "odg",
    "odf",
    "txt",
    "ps",
    "tex",
  ],
  Applications: ["exe", "dmg", "pkg", "deb"],
};

let command = input[0]; //after slicing, 0th index has choice command
switch (command) {
  case "tree":
    treefn(input[1]);
    break;
  case "organize":
    organizefn(input[1]); //after slicing, 1st index has target folder path
    break;
  case "help":
    helpfn();
    break;
  default:
    console.log("please enter valid command");
}
/*---------------------------------------------------------tree command-------------------------------------------------------------*/

function treefn(directorypath) {
  if (directorypath == undefined) {
    directorypath = process.cwd();
    console.log(directorypath);
  }
  if (fs.existsSync(directorypath) == 0) {
    console.log("please enter valid a folder path");
    return;
  }
  treeHelper(directorypath, "");
}

function treeHelper(directorypath, indent) {
  let Children = fs.readdirSync(directorypath);
  let directoryName = path.basename(directorypath);
  console.log(indent + "└──" + directoryName);

  for (let i = 0; i < Children.length; i++) {
    let ChildPath = path.join(directorypath, Children[i]);
    if (fs.lstatSync(ChildPath).isDirectory()) {
      treeHelper(ChildPath, indent + "\t");
    } else {
      let FileName = path.basename(ChildPath);
      console.log(indent + "\t├──" + FileName);
    }
  }
}
/*---------------------------------------------------------organize command----------------------------------------------------------*/
function organizefn(directorypath) {
  if (directorypath == undefined) {
    directorypath = process.cwd();
    console.log(directorypath);
  }
  let exist = fs.existsSync(directorypath);
  if (exist == 0) {
    console.log("Please enter a valid folder path"); // entered invalid path
    return;
  }
  let OrganizedFilePath = path.join(directorypath, "Organized Files");
  exist = fs.existsSync(OrganizedFilePath);
  if (exist == 0) {
    fs.mkdirSync(OrganizedFilePath); // if the folder doesnt exist already, make one.
  }
  organizeHelper(directorypath, OrganizedFilePath);
}

function organizeHelper(directorypath, OrganizedFilePath) {
  let FileNames = fs.readdirSync(directorypath); //FileNames is an array of names of all content in the folder at directorypath
  for (let i = 0; i < FileNames.length; i++) {
    let FilePath = path.join(directorypath, FileNames[i]); //generate file's path by joining directorypath+filename
    let IsFile = fs.lstatSync(FilePath).isFile();
    if (IsFile) {
      let category = getCategory(FileNames[i]);
      sendFiles(OrganizedFilePath, FilePath, category);
      console.log(FileNames[i] + " sent to folder " + category);
    }
  }
}

function sendFiles(OrganizedFilePath, FilePath, category) {
  let newCategoryPath = path.join(OrganizedFilePath, category);
  if (fs.existsSync(newCategoryPath) == 0) {
    fs.mkdirSync(newCategoryPath);
  }
  let newfilename = path.basename(FilePath);
  let newfilePath = path.join(newCategoryPath, newfilename);
  fs.copyFileSync(FilePath, newfilePath);
  // fs.unlinkSync(FilePath); for deleting the original file, thus doing cut-paste operation.
}

function getCategory(Filename) {
  let ext = path.extname(Filename).slice(1); // slice at 1th index to omit '.' from ext name
  for (let type in types) {
    for (let i = 0; i < types[type].length; i++) {
      if (ext == types[type][i]) {
        return type;
      }
    }
  }
  return "Others";
}
/* -----------------------------------------------------------help command-----------------------------------------------------------------*/
function helpfn() {
  console.log(`
        list of commands :
            command tree "<Folder Path>"
            command organize "<Folder Path>"
            command help
    `);
}
