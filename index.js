
import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import qr from 'qr-image';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

function logger(req, res, next) {
    let message = '[' + req.method + '] ' + req.url;

    console.log(message);

    next();
}

app.use(express.json());
app.use(express.raw({ inflate: true, limit: '100kb', type: 'application/json' }));
app.use(logger);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/generate', (req, res) => {
    let url = req.body.userUrl;

    var qr_svg = qr.imageSync(url, { type: 'svg' });
    res.send(qr_svg);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});