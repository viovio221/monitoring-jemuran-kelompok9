const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./db');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// folder public
app.use(express.static('public'));

// PORT Railway
const PORT = process.env.PORT || 3000;

// TEST ROUTE
app.get('/', (req, res) => {
    res.send('Backend Railway berhasil jalan');
});

// INSERT DATA CUACA
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
                success: false,
                error: err
            });

        } else {

            res.json({
                success: true
            });
        }
    });
});

// DATA TERBARU
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

// RIWAYAT
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

// JALANKAN SERVER
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});