import { removeBackground } from '@imgly/background-removal-node';
import express from 'express';
import path from 'node:path';

const app = express()
const port = 3002
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));


app.post('/bg-remove', (req, res) => {
  let base64 = req.body.base64;
  base64 = 'data:image/png;base64,' + base64;
  
  const publicPath= `file://${path.resolve(`node_modules/@imgly/background-removal-node/dist/`)}/`;

  let config = {
    publicPath: publicPath,
    fetchArgs: {
      mode: 'no-cors'
    },
    output: {
      format: 'image/png',
      quality: 1,
    },
  };
  const blob = base64ToBlob(base64, 'image/png');

  removeBackground(blob, config).then(async (blob) => {
    res.contentType('image/png');
    const arrayBuffer = await blob.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  }).catch((error) => {
    res.status(500).send('Error removing background');
  });
})

app.listen(port, () => {
  console.log(`Remove Background app listening on port ${port}`)
})

function base64ToBlob(base64, mimeType) {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}