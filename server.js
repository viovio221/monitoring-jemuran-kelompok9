const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const PORT = 3000;

app.post('/api/cuaca', (req, res) => {

    const status = req.body.status_cuaca;

    let kondisi = '';
    let warna = '';

    if (status === 'HUJAN') {

        kondisi = 'Segera Angkat Pakaian';
        warna = 'MERAH';

    } else if (status === 'GERIMIS') {

        kondisi = 'Waspada Gerimis';
        warna = 'KUNING';

    } else {

        kondisi = 'Jemuran Aman';
        warna = 'HIJAU';
    }

    const sql = `
    INSERT INTO cuaca_log
    (status_cuaca, kondisi_jemuran, indikator_warna)
    VALUES (?, ?, ?)
    `;

    db.query(sql, [status, kondisi, warna], (err, result) => {

        if (err) {
            console.log(err);

            res.json({
                success: false
            });

        } else {

            res.json({
                success: true
            });
        }
    });
});

app.get('/api/cuaca-terbaru', (req, res) => {

    const sql = `
    SELECT * FROM cuaca_log
    ORDER BY id DESC
    LIMIT 1
    `;

    db.query(sql, (err, result) => {

        if (err) {
            res.json(err);
        } else {
            res.json(result[0]);
        }
    });
});


app.get('/api/riwayat', (req, res) => {

    const sql = `
    SELECT * FROM cuaca_log
    ORDER BY id DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/frontend/index.html');
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});