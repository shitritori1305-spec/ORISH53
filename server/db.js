const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'answers.json');
if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([], null, 2));

function readAll(){
  try{ return JSON.parse(fs.readFileSync(file, 'utf8')) || []; } catch(e){ return []; }
}

function writeAll(arr){
  fs.writeFileSync(file, JSON.stringify(arr, null, 2));
}

module.exports = {
  insertAnswer: (dataStr) => {
    const arr = readAll();
    const lastId = arr.length ? arr[arr.length - 1].id : 0;
    const id = lastId + 1;
    let parsed;
    try { parsed = JSON.parse(dataStr); } catch (e) { parsed = dataStr; }
    const item = { id, timestamp: new Date().toISOString(), data: parsed };
    arr.push(item);
    writeAll(arr);
    return id;
  },
  listAnswers: () => readAll(),
  deleteAnswer: (id) => {
    const arr = readAll();
    const idx = arr.findIndex(x=>x.id === id);
    if(idx===-1) return false;
    arr.splice(idx,1);
    writeAll(arr);
    return true;
  },
  clearAnswers: () => { writeAll([]); }
};
