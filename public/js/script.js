let sepet = [];
let aktifUrunBazFiyat = 0;

document.addEventListener("DOMContentLoaded", function() {
    eskiKodlariTemizle();
    const detayliModalVarMi = document.getElementById('urunSecenekModal');
    if (!detayliModalVarMi) {
        basitModalEnjekteEt();
    }
    ortakElementleriEnjekteEt();

    hafizadanYukle();
    inputKontrolleriniBaslat();

    menuGosterGizle();

    if (detayliModalVarMi) {
        const selectler = detayliModalVarMi.querySelectorAll('select');
        selectler.forEach(select => {
            select.addEventListener('change', fiyatHesaplaGuncelle);
        });
    }
});
if (anaSayfadaMiyiz() && !document.getElementById('ustMenu')) {
    const menuHTML = `
          <div id="ustMenu" style="
              position: absolute; 
              top: 30px; 
              left: 30px; 
              z-index: 999999; 
              display: flex; 
              gap: 20px;
              font-family: 'Poppins', sans-serif;
          ">
              <a href="/hakkimizda" style="
                  text-decoration:none; 
                  color: white; 
                  font-weight:600; 
                  font-size:16px; 
                  text-shadow: 0px 1px 3px rgba(0,0,0,0.8);
              ">Hakkımızda</a>
              
              <a href="/#iletisim" style="
                  text-decoration:none; 
                  color: white;
                  font-weight:600; 
                  font-size:16px; 
                  text-shadow: 0px 1px 3px rgba(0,0,0,0.8);
              ">Bize Ulaşın</a>
          </div>`;
    document.body.insertAdjacentHTML('afterbegin', menuHTML);
}

function anaSayfadaMiyiz() {
    const yol = window.location.pathname;
    return yol === '/' || yol.endsWith('index.html') || yol.endsWith('budva-cafe/');
}

function ortakElementleriEnjekteEt() {
    if (anaSayfadaMiyiz() && !document.getElementById('ustMenu')) {
        const menuHTML = `
              <div id="ustMenu" style="
                  position: absolute; 
                  top: 30px; 
                  left: 30px; 
                  z-index: 999999; /* Tıklanabilmesi için en üste */
                  display: flex; 
                  gap: 20px;
                  font-family: 'Poppins', sans-serif;
              ">
                  <a href="/hakkimizda" style="text-decoration:none; color:#333; font-weight:600; font-size:16px; text-shadow: 0px 0px 10px rgba(255,255,255,0.8);">Hakkımızda</a>
                  
                  <a href="/#iletisim" style="text-decoration:none; color:#333; font-weight:600; font-size:16px; text-shadow: 0px 0px 10px rgba(255,255,255,0.8);">Bize Ulaşın</a>
              </div>`;
        document.body.insertAdjacentHTML('afterbegin', menuHTML);
    }

    if (!document.getElementById('sepetModal')) {
        const sepetHTML = `
              <div id="sepetModal" class="cart-modal" style="display:none;">
                  <div class="cart-content">
                      <span class="close-btn" onclick="sepetiKapat()" style="float:right; font-size:24px; cursor:pointer;">&times;</span>
                      <h2 style="color:#00796b;">Sepetim</h2>
                      <div id="sepetIcerik" class="cart-items" style="margin-top:15px; max-height:300px; overflow-y:auto;"></div>
                      <div style="display:flex; justify-content:space-between; margin: 20px 0; border-top: 1px solid #eee; padding-top: 15px;">
                          <span style="font-size:18px; font-weight:600;">Toplam:</span>
                          <span id="sepetToplam" class="total-price">0</span> ₺
                      </div>
                      <button onclick="siparisVer()" style="width:100%; padding:12px; background:#00796b; color:white; border:none; border-radius:8px; cursor:pointer; font-size:16px;">Siparişi Tamamla</button>
                  </div>
              </div>`;
        document.body.insertAdjacentHTML('beforeend', sepetHTML);
    }

    if (!document.getElementById('odemeModal')) {
        const odemeHTML = `
              <div id="odemeModal" class="payment-modal" style="display:none;">
                  <div class="payment-content">
                      <span class="close-btn" onclick="odemeKapat()">&times;</span>
                      <h2>Ödeme Yöntemi</h2>
                      <div class="payment-methods">
                          <div class="method-option active" id="opt-kart" onclick="odemeYontemiSec('kart')"><i class="fas fa-credit-card"></i> Kredi Kartı</div>
                          <div class="method-option" id="opt-nakit" onclick="odemeYontemiSec('nakit')"><i class="fas fa-money-bill-wave"></i> Nakit</div>
                      </div>
                      <div id="kartFormu" class="card-form">
                          <div class="input-group"><label>Kart Sahibi</label><input type="text" id="kartSahibi" placeholder="Ad Soyad"></div>
                          <div class="input-group"><label>Kart No</label><input type="text" id="kartNo" placeholder="0000 0000 0000 0000" maxlength="19"></div>
                          <div class="row">
                              <div class="input-group"><label>SKT</label><input type="text" id="kartSKT" placeholder="AA/YY" maxlength="5"></div>
                              <div class="input-group"><label>CVC</label><input type="text" id="kartCVC" placeholder="123" maxlength="3"></div>
                          </div>
                      </div>
                      <div id="nakitBilgi" class="cash-info" style="display:none; padding:20px; background:#e8f5e9; border:1px solid #c8e6c9; text-align:center; color:#2e7d32;">
                          Ödemenizi kasada yapabilirsiniz.
                      </div>
                      <div class="payment-total"><span>Ödenecek:</span><span id="odemeToplamTutar" style="float:right;">0 ₺</span></div>
                      <button class="pay-btn" onclick="odemeyiBitir()"><span id="btnYazi">KART İLE ÖDE</span><div id="loadingSpinner" class="spinner" style="display:none;"></div></button>
                  </div>
              </div>`;
        document.body.insertAdjacentHTML('beforeend', odemeHTML);
    }

    if (!document.getElementById('basariliModal')) {
        document.body.insertAdjacentHTML('beforeend', `<div id="basariliModal" class="success-modal" style="display:none;"><div class="success-content"><div class="checkmark-circle"><div class="checkmark draw"></div></div><h2>Sipariş Alındı!</h2><button onclick="sayfayiYenile()" class="ok-btn">TAMAM</button></div></div>`);
    }
    if (!document.getElementById('bildirim-kutusu')) {
        document.body.insertAdjacentHTML('beforeend', `<div id="bildirim-kutusu">Sepete Eklendi!</div>`);
    }
}

function basitModalEnjekteEt() {
    const html = `
          <div id="urunSecenekModal" class="modal" style="display:none; position:fixed; z-index:3000; left:0; top:0; width:100%; height:100%; background:rgba(0,0,0,0.5);">
              <div class="modal-content" style="background:#fff; margin:15% auto; padding:20px; width:90%; max-width:350px; border-radius:10px; position:relative;">
                  <span onclick="secenekleriKapat()" class="close-btn-abs" style="position:absolute; right:15px; top:10px; font-size:24px; cursor:pointer;">&times;</span>
                  <div style="text-align:center;">
                      <img id="modal-urun-resim" src="" style="width:100px; height:100px; object-fit:cover; border-radius:50%; margin-bottom:10px;">
                      <h3 id="modal-urun-adi">Ürün Adı</h3>
                      <p style="color:#666;">Baz Fiyat: <span id="modal-baz-fiyat">0</span> ₺</p>
                  </div>
                  <div style="margin:20px 0;">
                      <select id="modal-boy" onchange="fiyatHesaplaGuncelle()" style="width:100%; padding:8px; margin-top:5px; border:1px solid #ddd; border-radius:5px;">
                           <option value="0">Küçük Boy</option>
                           <option value="15">Orta Boy (+15 ₺)</option>
                           <option value="25">Büyük Boy (+25 ₺)</option>
                      </select>
                  </div>
                  <div style="text-align:center; font-weight:bold; margin-bottom:10px;">Toplam: <span id="modal-toplam-fiyat">0</span> ₺</div>
                  <button onclick="secimleriOnayla()" style="width:100%; background:#00796b; color:white; padding:10px; border:none; border-radius:5px; cursor:pointer;">Sepete Ekle</button>
              </div>
          </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
}


function menuGosterGizle() {
    const menu = document.getElementById('ustMenu');
    if (menu) {
        if (anaSayfadaMiyiz()) {
            menu.style.display = 'flex';
        } else {
            menu.style.display = 'none';
        }
    }
}

function urunSecenekleriniAc(ad, fiyat, resim) {
    aktifUrunBazFiyat = parseFloat(fiyat);
    document.getElementById('modal-urun-adi').innerText = ad;
    document.getElementById('modal-baz-fiyat').innerText = fiyat;
    document.getElementById('modal-urun-resim').src = resim;

    const selectler = document.querySelectorAll('#urunSecenekModal select');
    selectler.forEach(sel => sel.selectedIndex = 0);

    fiyatHesaplaGuncelle();
    document.getElementById('urunSecenekModal').style.display = 'block';

    const ustMenu = document.getElementById('ustMenu');
    if (ustMenu) ustMenu.style.display = 'none';
}

function fiyatHesaplaGuncelle() {
    let toplam = aktifUrunBazFiyat;
    const selectler = document.querySelectorAll('#urunSecenekModal select');
    selectler.forEach(sel => {
        toplam += parseFloat(sel.value) || 0;
    });
    const toplamAlan = document.getElementById('modal-toplam-fiyat');
    if (toplamAlan) toplamAlan.innerText = toplam;
}

function secimleriOnayla() {
    let ad = document.getElementById('modal-urun-adi').innerText;
    let resim = document.getElementById('modal-urun-resim').src;
    let sonFiyat = parseFloat(document.getElementById('modal-toplam-fiyat').innerText);

    let secenekIsimleri = [];
    const selectler = document.querySelectorAll('#urunSecenekModal select');

    selectler.forEach(sel => {
        let secilenText = sel.options[sel.selectedIndex].text;
        let temizIsim = secilenText.split('(')[0].trim();
        if (parseFloat(sel.value) > 0 || temizIsim.includes("Süt") || temizIsim.includes("Şeker") || temizIsim.includes("Shot")) {
            if (!temizIsim.includes("Küçük") && !temizIsim.includes("İstemiyorum") && !temizIsim.includes("Standart") && !temizIsim.includes("Normal")) {
                secenekIsimleri.push(temizIsim);
            }
        }
    });

    let urunTamAdi = ad;
    if (secenekIsimleri.length > 0) {
        urunTamAdi += ` (${secenekIsimleri.join(', ')})`;
    }
    sepeteEkleDirekt(urunTamAdi, sonFiyat, resim);
    secenekleriKapat();
}

function sepeteEkleDirekt(ad, fiyat, resim) {
    sepet.push({ ad, fiyat: parseFloat(fiyat), resim });
    sepetiKaydetVeGuncelle();
    bildirimGoster();
}

function eskiKodlariTemizle() {
    ['sepetModal', 'odemeModal', 'basariliModal', 'bildirim-kutusu'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });
}

function sepetiAc() {
    document.getElementById('sepetModal').style.display = 'block';
    const m = document.getElementById('ustMenu');
    if (m) m.style.display = 'none';
}

function sepetiKapat() {
    document.getElementById('sepetModal').style.display = 'none';
    menuGosterGizle();
}

function secenekleriKapat() {
    document.getElementById('urunSecenekModal').style.display = 'none';
    menuGosterGizle();
}

function sepetiKaydetVeGuncelle() {
    localStorage.setItem("sepet", JSON.stringify(sepet));
    sepetiGuncelle();
}

function sepetiGuncelle() {
    const s = document.getElementById('sepetSayisi');
    if (s) s.innerText = sepet.length;
    const c = document.getElementById('sepetIcerik');
    const t = document.getElementById('sepetToplam');
    if (c) {
        c.innerHTML = '';
        let tot = 0;
        sepet.forEach((u, i) => {
            tot += u.fiyat;
            c.innerHTML += `<div class="cart-item" style="display:flex; align-items:center; gap:10px; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;"><img src="${u.resim}" width="50" style="border-radius:5px;"><div style="flex:1;"><div style="font-weight:600; font-size:14px;">${u.ad}</div><div style="font-size:13px; color:#666;">${u.fiyat} ₺</div></div><i class="fas fa-trash" onclick="sepettenCikar(${i})" style="color:red; cursor:pointer;"></i></div>`;
        });
        if (t) t.innerText = tot;
    }
}

function sepettenCikar(i) {
    sepet.splice(i, 1);
    sepetiKaydetVeGuncelle();
}

function hafizadanYukle() {
    if (localStorage.getItem("sepet")) {
        try {
            sepet = JSON.parse(localStorage.getItem("sepet"));
            sepetiGuncelle();
        } catch (e) { localStorage.removeItem("sepet"); }
    }
}

function bildirimGoster() {
    const k = document.getElementById("bildirim-kutusu");
    if (k) {
        k.className = "goster";
        setTimeout(() => { k.className = ""; }, 3000);
    }
}

function siparisVer() {
    if (sepet.length === 0) { alert("Sepetiniz boş!"); return; }
    sepetiKapat();
    document.getElementById('odemeModal').style.display = 'block';
    let tot = 0;
    sepet.forEach(u => tot += u.fiyat);
    document.getElementById('odemeToplamTutar').innerText = tot + " ₺";
    odemeYontemiSec('kart');
}

function odemeKapat() {
    document.getElementById('odemeModal').style.display = 'none';
    menuGosterGizle();
}


function odemeYontemiSec(y) {
    const k = document.getElementById('kartFormu'),
        n = document.getElementById('nakitBilgi'),
        bk = document.getElementById('opt-kart'),
        bn = document.getElementById('opt-nakit'),
        by = document.getElementById('btnYazi');
    if (y === 'kart') {
        k.style.display = 'block';
        n.style.display = 'none';
        bk.classList.add('active');
        bn.classList.remove('active');
        by.innerText = "KART İLE ÖDE";
    } else {
        k.style.display = 'none';
        n.style.display = 'block';
        bk.classList.remove('active');
        bn.classList.add('active');
        by.innerText = "SİPARİŞİ TAMAMLA";
    }
}

function mesajGonder() {
    const isim = document.getElementById('isim').value;
    const email = document.getElementById('email').value;
    const mesaj = document.getElementById('mesaj').value;

    if (!isim || !email || !mesaj) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    fetch('/iletisim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isim, email, mesaj })
        })
        .then(response => {
            if (response.ok) {
                const bildirim = document.getElementById('bildirim-kutusu');
                bildirim.innerText = "Mesajınız alınmıştır, teşekkür ederiz! ✅";
                bildirim.classList.add('goster');
                document.getElementById('iletisimFormu').reset();
                setTimeout(() => {
                    bildirim.classList.remove('goster');
                }, 3000);
            }
        })
        .catch(err => {
            console.error("Hata:", err);
            alert("Mesaj gönderilirken bir hata oluştu.");
        });
}

function odemeyiBitir() {
    if (document.getElementById('kartFormu').style.display !== 'none') {
        const no = document.getElementById('kartNo').value,
            skt = document.getElementById('kartSKT').value,
            cvc = document.getElementById('kartCVC').value,
            isim = document.getElementById('kartSahibi').value;
        if (no.length < 19 || skt.length < 5 || cvc.length < 3 || isim.length < 3) { alert("Lütfen kart bilgilerini eksiksiz girin!"); return; }
    }
    const by = document.getElementById('btnYazi'),
        s = document.getElementById('loadingSpinner'),
        b = document.querySelector('.pay-btn');
    by.style.display = 'none';
    s.style.display = 'block';
    b.disabled = true;
    b.style.opacity = "0.7";
    setTimeout(() => {
        document.getElementById('odemeModal').style.display = 'none';
        document.getElementById('basariliModal').style.display = 'block';
        sepet = [];
        localStorage.removeItem('sepet');
        sepetiGuncelle();
        by.style.display = 'block';
        s.style.display = 'none';
        b.disabled = false;
        b.style.opacity = "1";
    }, 2000);
}

function inputKontrolleriniBaslat() {
    const isim = document.getElementById('kartSahibi');
    if (isim) isim.addEventListener('input', e => e.target.value = e.target.value.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ ]/g, ''));
    const no = document.getElementById('kartNo');
    if (no) no.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    });
    const skt = document.getElementById('kartSKT');
    if (skt) skt.addEventListener('input', e => {
        let v = e.target.value.replace(/\D/g, '');
        if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2, 4);
        e.target.value = v;
    });
    const cvc = document.getElementById('kartCVC');
    if (cvc) cvc.addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, ''));
}
let urunler = [
    { id: 1, ad: "Martini Mocktail", fiyat: 180, resim: "/img/martinimoctail.jpg", kategori: "mocktail" },
    { id: 2, ad: "Cool Lime", fiyat: 150, resim: "/img/coollime.jpg", kategori: "mocktail" },
    { id: 3, ad: "Çay", fiyat: 20, resim: "/img/cay.jpg", kategori: "sicak" },
    { id: 4, ad: "Latte", fiyat: 90, resim: "/img/latte.jpg", kategori: "sicak" },
    { id: 5, ad: "Ice Americano", fiyat: 85, resim: "/img/ice-americano.jpg", kategori: "soguk" }
];

function sayfayiYenile() { location.reload(); }

window.onclick = function(e) {
    if (e.target == document.getElementById('sepetModal')) sepetiKapat();
    if (e.target == document.getElementById('odemeModal')) odemeKapat();
    if (e.target == document.getElementById('urunSecenekModal')) secenekleriKapat();
};

function sepeteEkle(ad, fiyat, resim) {
    sepeteEkleDirekt(ad, fiyat, resim);
}