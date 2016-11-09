import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import templateData from '../keys.json';
const ejsPath = path.join(__dirname, '../', 'index.ejs');
const outputPath = path.join(__dirname, '../', 'dist', 'index.html');

ejs.renderFile(ejsPath, templateData, undefined, function(err, str){
  fs.writeFileSync(outputPath, str);
});
