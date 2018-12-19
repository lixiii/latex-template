var path = require('path'); 
var fs=require('fs');
var count = 0;

function fromDir(startPath,filter,callback){

    if (!fs.existsSync(startPath)){
        console.log(`Error: The directory ${startPath} does not exist.`);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename = files[i];
        if (filter.test(filename)) callback(filename);
    };
};


console.log("This script takes all the matlab (.m) files in ./matlab/ (ie ./matlab/*.m) and copies them into ./build/*.m with a header and a footer. \n");

// make directory
if (!fs.existsSync("./build/")){
  fs.mkdirSync("./build/");
}

// delete all files
fs.readdirSync("./build/", (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlinkSync(path.join("./build/", file), err => {
      if (err) throw err;
    });
  }
});

// now process the matlab files
fromDir('./matlab/',/\.m$/,function(filename){
    console.log('Processing file: ',filename);

    var filepath = path.join('./matlab/',filename);
    var data = fs.readFileSync( filepath ); //read existing contents into data
    var headerStr = "%".repeat(filename.length + 22) + "\n" + `%%    Filename: ${filename}    %%\n` + 
                    "%".repeat(filename.length + 22) + "\n\n";
    var footerStr = `\n\n%%   End of file ${filename}   %%`;
    var header = new Buffer(headerStr);
    var footer = new Buffer(footerStr);

    var newData = Buffer.concat([header, data, footer]);

    fs.writeFileSync(path.join("./build/", filename), newData);
    count++;
});

console.log(`\n-------------------------\nProcessed ${count} files \n`);