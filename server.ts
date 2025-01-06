import express from 'express';

const app = express();

console.log('hello world');

app.listen(2000, () => {
  console.log('server is running');
});
