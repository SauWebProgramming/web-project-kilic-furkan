// Dosya adı: script.js

// --- GLOBAL DEĞİŞKENLER ---
let globalKitaplar = []; 

// Sayfa yüklendiğinde çalışacak kod
document.addEventListener('DOMContentLoaded', () => {
    kitaplariGetir(""); // Tüm kitapları getir
});

// HTML Elemanlarını Seçme
const listeDiv = document.getElementById('kitap-listesi');
const aramaInput = document.getElementById('aramaInput');
const modal = document.getElementById('detay-modal');

// --- 1. VERİ ÇEKME (FETCH) ---
async function kitaplariGetir() {
    try {
        // 'kitaplar.json' dosyasını oku
        const cevap = await fetch('kitaplar.json');
        
        // Gelen veriyi listeye çevir ve global değişkene at
        globalKitaplar = await cevap.json();

        // Ekrana bas
        filtreleVeGoster("");

    } catch (hata) {
        console.error("Hata:", hata);
        listeDiv.innerHTML = "<h3>Veri dosyası (kitaplar.json) bulunamadı!</h3>";
    }
}

// --- 2. ARA BUTONU İÇİN FONKSİYON ---
function aramayiBaslat() {
    filtreleVeGoster(aramaInput.value);
}

// --- 3. FİLTRELEME VE HTML OLUŞTURMA ---
function filtreleVeGoster(aranan) {
    listeDiv.innerHTML = ""; // Rafı temizle

    const sonucListesi = globalKitaplar.filter(kitap => {
        const kucukHarfAranan = aranan.toLowerCase();
        return kitap.title.toLowerCase().includes(kucukHarfAranan) || 
               kitap.author.toLowerCase().includes(kucukHarfAranan);
    });

    if (sonucListesi.length === 0) {
        listeDiv.innerHTML = "<h3>Kitap bulunamadı.</h3>";
        return;
    }

    sonucListesi.forEach(kitap => {
        const kartHTML = `
            <div class="kitap-karti">
                <img src="${kitap.image}" alt="${kitap.title}">
                <h3>${kitap.title}</h3>
                <p>${kitap.author}</p>
                <p class="fiyat">${kitap.price} ₺</p>
                <button class="btn-incele" onclick="detayAc(${kitap.id})">İncele</button>
            </div>
        `;
        listeDiv.innerHTML += kartHTML;
    });
}

// --- 4. DETAY PENCERESİNİ AÇ (MODAL) ---
function detayAc(id) {
    const kitap = globalKitaplar.find(k => k.id === id);

    if (kitap) {
        document.getElementById('modal-resim').src = kitap.image;
        document.getElementById('modal-baslik').innerText = kitap.title;
        document.getElementById('modal-yazar').innerText = "Yazar: " + kitap.author;
        document.getElementById('modal-kategori').innerText = "Kategori: " + kitap.category;
        document.getElementById('modal-aciklama').innerText = kitap.desc;
        document.getElementById('modal-fiyat').innerText = kitap.price + " ₺";

        modal.style.display = "block";
    }
}

// --- 5. DETAY PENCERESİNİ KAPAT ---
function modalKapat() {
    modal.style.display = "none";
}

// Siyah boşluğa tıklayınca da kapansın
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}