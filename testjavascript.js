
const genelist = ['GENE', 'EGFR;EGFR-AS1'];
const data = 'EGFR0';
const result = genelist.findIndex(item => item.split(';').includes(data));
console.log(result);
console.log(genelist[1].split(';').includes('EGFR'));



