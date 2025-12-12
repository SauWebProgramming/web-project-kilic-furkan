let globalKitaplar = []; 
let secilenKitapId = null;

document.addEventListener('DOMContentLoaded', () => {
    kitaplariGetir(); 
    forumuYukle(); 
    
    // DÜZELTME: Başlangıçta Forum Sayfası Açılsın
    sayfaDegistir('forum');
});

const listeDiv = document.getElementById('kitap-listesi');
const aramaInput = document.getElementById('aramaInput');
const modal = document.getElementById('detay-modal');
const loader = document.getElementById('loader');
const listeBaslik = document.getElementById('liste-baslik');

// --- SAYFA GEÇİŞ SİSTEMİ ---
function sayfaDegistir(sayfaAdi) {
    // Sayfaları gizle
    document.getElementById('magaza-sayfasi').classList.add('gizli');
    document.getElementById('forum-sayfasi').classList.add('gizli');

    // Butonların aktifliğini sil
    document.getElementById('btn-magaza').classList.remove('aktif');
    document.getElementById('btn-forum').classList.remove('aktif');

    // İstenen sayfayı aç
    if (sayfaAdi === 'magaza') {
        document.getElementById('magaza-sayfasi').classList.remove('gizli');
        document.getElementById('btn-magaza').classList.add('aktif');
    } else if (sayfaAdi === 'forum') {
        document.getElementById('forum-sayfasi').classList.remove('gizli');
        document.getElementById('btn-forum').classList.add('aktif');
    }
}

// --- MAĞAZA SIFIRLAMA (FAVORİLERDEN ÇIKIŞ) ---
// Bu fonksiyon "Mağaza" butonuna basınca çalışır.
// Favori filtresini kaldırır ve tüm kitapları geri getirir.
function magazayiSifirlaVeAc() {
    // 1. Arama kutusunu temizle
    aramaInput.value = "";
    // 2. Başlığı gizle (Favorilerim yazısını kaldır)
    listeBaslik.style.display = "none";
    // 3. Tüm listeyi yeniden bas
    listeyiEkranaBas(globalKitaplar);
    // 4. Mağaza sayfasına geç
    sayfaDegistir('magaza');
}

// --- FORUM VERİLERİ (Sahte Veri) ---
// bookId: Bu konunun hangi kitapla ilgili olduğunu belirtir (Mağazaya yönlendirmek için)
const forumVerileri = [
    { id: 1, bookId: 10, user: "Elif Kitapkurdu", title: "Dostoyevski'ye Hangi Kitapla Başlanmalı?", body: "Rus edebiyatına girmek istiyorum ama Suç ve Ceza çok mu ağır olur? Önerilerinizi bekliyorum.", likes: 45, comments: 12, time: "2 saat önce" },
    { id: 2, bookId: 8, user: "BilimKurgu Sever", title: "Dune Filmi Kitabın Hakkını Verdi mi?", body: "Kitabı 3 kere okudum, film görsel olarak harika ama içsel monologlar eksik gibi geldi. Siz ne düşünüyorsunuz?", likes: 120, comments: 84, time: "5 saat önce" },
    { id: 3, bookId: 7, user: "Tarihçi_Bey", title: "Sapiens Kitabı Hakkında Düşünceler", body: "Yuval Noah Harari'nin tespitleri çok çarpıcı ama bazı kısımları fazla spekülatif buldum. Okuyan var mı?", likes: 89, comments: 5, time: "1 gün önce" },
    { id: 4, bookId: 3, user: "Roman Okuru", title: "Simyacı neden bu kadar abartılıyor?", body: "Kitabı okudum, güzel bir masal ama 'hayat değiştiren kitap' yorumlarını abartılı buldum.", likes: 34, comments: 42, time: "3 gün önce" }
];

function forumuYukle() {
    const forumDiv = document.getElementById('forum-akisi');
    forumDiv.innerHTML = "";

    forumVerileri.forEach(post => {
        const basHarf = post.user.charAt(0);
        
        // DÜZELTME: onclick olayını tüm karta değil, sadece butona verdik.
        const postHTML = `
            <div class="forum-post">
                <div class="post-header">
                    <div class="avatar">${basHarf}</div>
                    <div>
                        <div class="user-name">${post.user}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <div class="post-title">${post.title}</div>
                <div class="post-content">${post.body}</div>
                <div class="post-footer">
                    <div class="stat"><span class="material-icons" style="font-size:16px">thumb_up</span> ${post.likes}</div>
                    <div class="stat"><span class="material-icons" style="font-size:16px">mode_comment</span> ${post.comments}</div>
                    
                    <button class="btn-konu-git" onclick="magazayaGitVeAc(${post.bookId})">
                        📖 Kitabı İncele
                    </button>
                </div>
            </div>
        `;
        forumDiv.innerHTML += postHTML;
    });
}

// --- MAĞAZAYA GİT VE DETAY AÇ ---
function magazayaGitVeAc(id) {
    magazayiSifirlaVeAc(); // Önce mağazayı aç ve listeyi düzelt
    
    // Küçük bir gecikme ile detayı aç (Listenin yüklenmesi için)
    setTimeout(() => {
        detayAc(id);
    }, 100);
}

// --- VERİ ÇEKME ---
async function kitaplariGetir() {
    loader.style.display = "block";
    try {
        const cevap = await fetch('kitaplar.json');
        globalKitaplar = await cevap.json();
        loader.style.display = "none";
        listeyiEkranaBas(globalKitaplar);
    } catch (hata) {
        console.error(hata);
        loader.style.display = "none";
        listeDiv.innerHTML = "<h3>Veri okunamadı!</h3>";
    }
}

function listeyiEkranaBas(kitapListesi) {
    listeDiv.innerHTML = "";
    if (kitapListesi.length === 0) {
        listeDiv.innerHTML = "<h3>Kitap bulunamadı.</h3>"; return;
    }
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

// --- ARAMA ---
function aramayiBaslat() {
    listeBaslik.style.display = "none";
    const aranan = aramaInput.value.toLowerCase();
    const sonuc = globalKitaplar.filter(k => k.title.toLowerCase().includes(aranan) || k.author.toLowerCase().includes(aranan));
    listeyiEkranaBas(sonuc);
}

// --- FAVORİLERİ GÖSTER ---
function favorileriGoster() {
    sayfaDegistir('magaza'); // Mağazaya geç
    const favoriIdleri = JSON.parse(localStorage.getItem('favoriler')) || [];
    const favoriKitaplar = globalKitaplar.filter(kitap => favoriIdleri.includes(kitap.id));
    
    listeBaslik.innerText = "⭐ Favori Kitaplarım";
    listeBaslik.style.display = "block";
    listeyiEkranaBas(favoriKitaplar);
}

// --- MODAL ---
function detayAc(id) {
    secilenKitapId = id;
    const kitap = globalKitaplar.find(k => k.id === id);
    if (kitap) {
        document.getElementById('modal-resim').src = kitap.image;
        document.getElementById('modal-baslik').innerText = kitap.title;
        document.getElementById('modal-yazar').innerText = kitap.author;
        document.getElementById('modal-kategori').innerText = kitap.category;
        document.getElementById('modal-aciklama').innerText = kitap.desc;
        document.getElementById('modal-fiyat').innerText = kitap.price + " ₺";
        butonDurumunuGuncelle();
        modal.style.display = "block";
    }
}

function favoriIslemi() {
    let favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
    if (favoriler.includes(secilenKitapId)) {
        favoriler = favoriler.filter(id => id !== secilenKitapId);
    } else { favoriler.push(secilenKitapId); }
    localStorage.setItem('favoriler', JSON.stringify(favoriler));
    butonDurumunuGuncelle();
}

function butonDurumunuGuncelle() {
    const btn = document.getElementById('modal-fav-btn');
    const favoriler = JSON.parse(localStorage.getItem('favoriler')) || [];
    if (favoriler.includes(secilenKitapId)) {
        btn.innerHTML = '<span class="material-icons">favorite</span> Favorilerden Çıkar';
        btn.style.backgroundColor = "#e74c3c"; btn.style.color = "white";
    } else {
        btn.innerHTML = '<span class="material-icons">favorite_border</span> Favorilere Ekle';
        btn.style.backgroundColor = "white"; btn.style.color = "#e74c3c";
    }
}

function modalKapat() { modal.style.display = "none"; }
window.onclick = function(e) { if(e.target == modal) modal.style.display = "none"; }