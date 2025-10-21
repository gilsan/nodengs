const fs = require('fs');

const csv = fs.readFileSync('../inhouseupload/polymorphism.csv', 'utf-8');
const lines = csv.split('\n');
const tabSeparated = lines.map(line => line.split(',').join('\t')).join('\n');

fs.writeFileSync('../inhouseupload/polymorphism.txt', tabSeparated);