// --- GLOBAL DEĞİŞKENLER ---
// Tüm kitapları burada tutacağız.
let globalKitaplar = []; 

// YENİ: Hangi kitabın detayına baktığımızı burada tutacağız.
// C#'taki "currentSelectedID" gibi düşün.
let secilenKitapId = null; 

// --- SAYFA YÜKLENİNCE ---
document.addEventListener('DOMContentLoaded', () => {
    kitaplariGetir(); // Verileri çek
});

// --- HTML ELEMANLARINI SEÇME ---
const listeDiv = document.getElementById('kitap-listesi');
const aramaInput = document.getElementById('aramaInput');
const modal = document.getElementById('detay-modal');
const loader = document.getElementById('loader');
const listeBaslik = document.getElementById('liste-baslik');

// --- 1. VERİ ÇEKME FONKSİYONU ---
async function kitaplariGetir() {
    loader.style.display = "block"; // Yükleniyor...
    try {
        // Dosyadan veriyi oku
        const cevap = await fetch('kitaplar.json');
        globalKitaplar = await cevap.json();
        
        loader.style.display = "none";
        
        // İlk açılışta tüm listeyi göster
        listeyiEkranaBas(globalKitaplar);

    } catch (hata) {
        console.error(hata);
        loader.style.display = "none";
        listeDiv.innerHTML = "<h3>Veri okunamadı!</h3>";
    }
}

// --- 2. LİSTEYİ EKRANA BASMA (ORTAK FONKSİYON) ---
// Bu fonksiyonu C#'taki "DataGridView.DataSource = liste" gibi düşün.
// Hangi listeyi verirsek (tüm kitaplar veya favoriler) onu ekrana çizer.
function listeyiEkranaBas(kitapListesi) {
    listeDiv.innerHTML = ""; // Önce ekranı temizle

    // Liste boşsa uyarı ver
    if (kitapListesi.length === 0) {
        listeDiv.innerHTML = "<h3>Kitap bulunamadı.</h3>";
        return;
    }

    // Listeyi dön ve kartları oluştur
    kitapListesi.forEach(kitap => {
        const kart = `
            <div class="kitap-karti">
                <img src="${kitap.image}" alt="${kitap.title}">
                <h3>${kitap.title}</h3>
                <p class="fiyat">${kitap.price} ₺</p>
                <button class="btn-incele" onclick="detayAc(${kitap.id})">İncele</button>
            </div>
        `;
        listeDiv.innerHTML += kart;
    });
}

// --- 3. ARAMA YAPMA ---
function aramayiBaslat() {
    listeBaslik.style.display = "none"; // "Favoriler" başlığını gizle
    const aranan = aramaInput.value.toLowerCase(); // Küçük harfe çevir
    
    // Filtreleme (Contains mantığı)
    const sonuc = globalKitaplar.filter(k => 
        k.title.toLowerCase().includes(aranan) || 
        k.author.toLowerCase().includes(aranan)
    );
    
    // Sonuçları ekrana bas
    listeyiEkranaBas(sonuc);
}

// --- 4. FAVORİLERİ GÖSTERME (BUTONA BASINCA) ---
function favorileriGoster() {
    // 1. Tarayıcı Hafızasından (LocalStorage) favori ID'lerini oku.
    // JSON.parse: Hafızadaki metni tekrar listeye çevirir.
    // || [] : Eğer hafıza boşsa hata verme, boş liste kabul et.
    const favoriIdleri = JSON.parse(localStorage.getItem('favoriler')) || [];

    // 2. Global listeden, sadece ID'si favorilerde olanları süz.
    const favoriKitaplar = globalKitaplar.filter(kitap => favoriIdleri.includes(kitap.id));

    // 3. Başlığı göster ve listeyi bas
    listeBaslik.innerText = "⭐ Favori Kitaplarım";
    listeBaslik.style.display = "block";
    listeyiEkranaBas(favoriKitaplar);
}

// --- 5. DETAY PENCERESİNİ AÇMA (MODAL) ---
function detayAc(id) {
    // Tıklanan kitabı global değişkene kaydet (Sonra favoriye eklerken lazım olacak)
    secilenKitapId = id; 

    // ID'si eşleşen kitabı bul
    const kitap = globalKitaplar.find(k => k.id === id);

    if (kitap) {
        // Modalın içini doldur
        document.getElementById('modal-resim').src = kitap.image;
        document.getElementById('modal-baslik').innerText = kitap.title;
        document.getElementById('modal-yazar').innerText = kitap.author;
        document.getElementById('modal-kategori').innerText = kitap.category;
        document.getElementById('modal-aciklama').innerText = kitap.desc;
        document.getElementById('modal-fiyat').innerText = kitap.price + " ₺";
        
        // BUTON KONTROLÜ: Bu kitap zaten favoride mi?
        // Eğer favorideyse butonu kırmızı yap, değilse beyaz yap.
        butonDurumunuGuncelle();

        // Pencereyi görünür yap
        modal.style.display = "block";
    }
}

// --- 6. FAVORİ EKLEME / ÇIKARMA İŞLEMİ ---
function favoriIslemi() {
    // 1. Mevcut favori listesini hafızadan çek
    let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];

    // 2. Bu kitap zaten listede var mı?
    if (favoriler.includes(secilenKitapId)) {
        // VARSA: Listeden çıkar (Filter ile bu ID hariç diğerlerini al)
        favoriler = favoriler.filter(id => id !== secilenKitapId);
    } else {
        // YOKSA: Listeye ekle (Push)
        favoriler.push(secilenKitapId);
    }

    // 3. Güncel listeyi tekrar hafızaya (LocalStorage) kaydet.
    // JSON.stringify: Listeyi metne çevirir (Hafıza sadece metin tutar).
    localStorage.setItem('favoriler', JSON.stringify(favoriler));

    // 4. Butonun rengini ve yazısını güncelle
    butonDurumunuGuncelle();
}

// --- YARDIMCI: BUTON GÖRÜNÜMÜNÜ AYARLA ---
function butonDurumunuGuncelle() {
    const btn = document.getElementById('modal-fav-btn');
    // Hafızayı kontrol et
    const favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];

    // Eğer şu anki kitap favorilerde varsa...
    if (favoriler.includes(secilenKitapId)) {
        // Butonu KIRMIZI ve "Çıkar" yap
        btn.innerHTML = '<span class="material-icons">favorite</span> Favorilerden Çıkar';
        btn.style.backgroundColor = "#e74c3c";
        btn.style.color = "white";
    } else {
        // Yoksa BEYAZ ve "Ekle" yap
        btn.innerHTML = '<span class="material-icons">favorite_border</span> Favorilere Ekle';
        btn.style.backgroundColor = "white";
        btn.style.color = "#e74c3c";
    }
}

// --- MODAL KAPATMA ---
function modalKapat() { modal.style.display = "none"; }
// Siyah alana tıklayınca kapat
window.onclick = function(e) { if(e.target == modal) modal.style.display = "none"; }