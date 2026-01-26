const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const app = express();

let menu = require('./data');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'gizli-budva-anahtari',
    resave: false,
    saveUninitialized: true
}));

function girisKontrol(req, res, next) {
    if (req.session.adminOturumu) {
        next();
    } else {
        res.redirect('/login');
    }
}
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        req.session.adminOturumu = true;
        res.redirect('/admin');
    } else {
        res.send('<script>alert("Hatalı kullanıcı adı veya şifre!"); window.location.href="/login";</script>');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});
 
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/hakkimizda', (req, res) => {
    res.render('hakkimizda');
});

app.get('/iletisim', (req, res) => {
    res.render('iletisim');
});

app.post('/iletisim', (req, res) => {
    console.log(req.body);
    res.json({ status: 'success' });
});
app.get('/espresso-bazli', (req, res) => {
    const sicakListesi = menu.filter(u => u.kategori === 'espresso');
    const sogukListesi = menu.filter(u => u.kategori === 'soguk_kahve');

    res.render('espresso-bazli', { 
        sicak: sicakListesi, 
        soguk: sogukListesi 
    });
});
app.get('/matcha', (req, res) => {
    const urunler = menu.filter(u => u.kategori === 'matcha');
    res.render('matcha', { urunler: urunler });
});

app.get('/mesrubatlar', (req, res) => {
    const urunler = menu.filter(u => u.kategori === 'mesrubat');
    res.render('mesrubatlar', { urunler: urunler });
});

app.get('/mocktails', (req, res) => {
    const urunler = menu.filter(u => u.kategori === 'mocktail');
    res.render('mocktails', { urunler: urunler });
});

app.get('/sandvicler', (req, res) => {
    const urunler = menu.filter(u => u.kategori === 'atistirmalik');
    res.render('sandvicler', { urunler: urunler });
});

app.get('/sicak-icecekler', (req, res) => {
    const urunler = menu.filter(u => u.kategori === 'sicak_icecek');
    res.render('sicak-icecekler', { urunler: urunler });
});

app.get('/soguk-kahveler', (req, res) => {
    const urunler = menu.filter(u => u.kategori === 'soguk_kahve');
    res.render('soguk-kahveler', { urunler: urunler });
});

app.get('/soguk-icecekler', (req, res) => {
    const urunler = menu.filter(u => u.kategori === 'soguk_special');
    res.render('soguk-icecekler', { urunler: urunler });
});

app.get('/tatlilar', (req, res) => {
    const urunler = menu.filter(u => u.kategori === 'tatli');
    res.render('tatlilar', { urunler: urunler });
});

app.get('/admin', girisKontrol, (req, res) => {
    res.render('admin', { menu: menu });
});

app.post('/admin/ekle', girisKontrol, (req, res) => {
    const yeniUrun = {
        id: Date.now(),
        ad: req.body.ad,
        fiyat: parseInt(req.body.fiyat),
        resim: req.body.resim || "/img/logo.png",
        kategori: req.body.kategori,
        aciklama: req.body.aciklama || ""
    };
    menu.push(yeniUrun);
    res.redirect('/admin');
});

app.post('/admin/sil/:id', girisKontrol, (req, res) => {
    const id = parseInt(req.params.id);
    let index = menu.findIndex(u => u.id === id);
    if (index > -1) {
        menu.splice(index, 1);
    }
    res.redirect('/admin');
});

app.post('/admin/guncelle/:id', girisKontrol, (req, res) => {
    const urun = menu.find(u => u.id === parseInt(req.params.id));
    if (urun) {
        urun.fiyat = parseInt(req.body.yeniFiyat);
    }
    res.redirect('/admin');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
    console.log(`Siteye git: http://localhost:${PORT}`);
    console.log(`Admine git: http://localhost:${PORT}/admin`);
});