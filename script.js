let globalKitaplar = []; 
let secilenKitapId = null;
let aktifForumKonuId = null;
let aktifKategori = 'Tümü';

document.addEventListener('DOMContentLoaded', () => {
    kitaplariGetir(); 
    if (!localStorage.getItem('forumData')) {
        localStorage.setItem('forumData', JSON.stringify(baslangicForumVerileri));
    }
    forumuYukle(); 
    sayfaDegistir('forum');
});

const listeDiv = document.getElementById('kitap-listesi');
const aramaInput = document.getElementById('aramaInput');
const modal = document.getElementById('detay-modal');
const loader = document.getElementById('loader');
const listeBaslik = document.getElementById('liste-baslik');

function sayfaDegistir(sayfaAdi) {
    document.getElementById('magaza-sayfasi').classList.add('gizli');
    document.getElementById('forum-sayfasi').classList.add('gizli');
    document.getElementById('forum-detay-sayfasi').classList.add('gizli');

    document.getElementById('btn-magaza').classList.remove('aktif');
    document.getElementById('btn-forum').classList.remove('aktif');

    if (sayfaAdi === 'magaza') {
        document.getElementById('magaza-sayfasi').classList.remove('gizli');
        document.getElementById('btn-magaza').classList.add('aktif');
    } else if (sayfaAdi === 'forum') {
        document.getElementById('forum-sayfasi').classList.remove('gizli');
        document.getElementById('btn-forum').classList.add('aktif');
        forumuYukle(); 
    } else if (sayfaAdi === 'forum-detay') {
        document.getElementById('forum-detay-sayfasi').classList.remove('gizli');
        document.getElementById('btn-forum').classList.add('aktif');
        window.scrollTo(0,0);
    }
}

function magazayiSifirlaVeAc() {
    aramaInput.value = "";
    const tumuBtn = document.querySelector(".cat-btn");
    kategoriSec('Tümü', tumuBtn); 
    listeBaslik.style.display = "none";
    listeyiEkranaBas(globalKitaplar);
    sayfaDegistir('magaza');
}

function kategoriSec(kategori, btnElement) {
    aktifKategori = kategori;
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('aktif'));
    
    if(btnElement) {
        btnElement.classList.add('aktif');
    } else {
        const buttons = document.querySelectorAll('.cat-btn');
        for (let btn of buttons) {
            if (btn.innerText === kategori) btn.classList.add('aktif');
        }
    }
    aramayiBaslat(); 
}

function aramayiBaslat() {
    listeBaslik.style.display = "none";
    const arananMetin = aramaInput.value.toLowerCase();
    const secilenKategori = aktifKategori; 

    const sonuc = globalKitaplar.filter(kitap => {
        const metinUyumu = kitap.title.toLowerCase().includes(arananMetin) || 
                           kitap.author.toLowerCase().includes(arananMetin);
        const kategoriUyumu = (secilenKategori === "Tümü") || (kitap.category === secilenKategori);
        return metinUyumu && kategoriUyumu;
    });

    listeyiEkranaBas(sonuc);
}

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
        listeDiv.innerHTML = "<h3>Aradığınız kriterlere uygun kitap bulunamadı.</h3>";
        return;
    }
    kitapListesi.forEach(kitap => {
        // GÜNCELLEME: Semantic HTML için 'div' yerine 'article' kullanıldı.
        const kart = `
            <article class="kitap-karti">
                <img src="${kitap.image}" alt="${kitap.title}" onerror="this.src='https://placehold.co/200x300?text=Resim+Yok'">
                <h3>${kitap.title}</h3>
                <p class="fiyat">${kitap.price} ₺</p>
                <button class="btn-incele" onclick="detayAc(${kitap.id})">İncele</button>
            </article>
        `;
        listeDiv.innerHTML += kart;
    });
}

const baslangicForumVerileri = [
    { 
        id: 1, bookId: 10, user: "Elif Kitapkurdu", title: "Dostoyevski'ye Hangi Kitapla Başlanmalı?", 
        body: "Rus edebiyatına girmek istiyorum ama Suç ve Ceza çok mu ağır olur? Önerilerinizi bekliyorum.", likes: 45, time: "2 saat önce",
        comments: [
            { user: "Hasan Çevik", text: "Kesinlikle Suç ve Ceza ile başlayın.", time: "1 saat önce" },
            { user: "Büşra Okur", text: "Bence önce Yeraltından Notlar daha kısa.", time: "45 dakika önce" }
        ]
    },
    { id: 2, bookId: 8, user: "BilimKurgu Sever", title: "Dune Filmi Kitabın Hakkını Verdi mi?", body: "İçsel monologlar eksik gibi geldi.", likes: 120, time: "5 saat önce", comments: [] },
    { id: 3, bookId: 3, user: "Roman Okuru", title: "Simyacı abartılıyor mu?", body: "Güzel ama abartılı yorumlar var.", likes: 34, time: "3 gün önce", comments: [] },
    { id: 4, bookId: 1, user: "Junior Dev", title: "Temiz Kod'u bitirdim", body: "Fonksiyonlar kısa olmalı fikri güzel.", likes: 56, time: "4 saat önce", comments: [] },
    { id: 5, bookId: 5, user: "Distopya Fan", title: "1984 kehaneti", body: "Bugünü görmüş resmen.", likes: 230, time: "1 hafta önce", comments: [] },
    { id: 6, bookId: 12, user: "Büyücü", title: "Hogwarts Mektubum", body: "Hala gelmedi :(", likes: 89, time: "1 saat önce", comments: [] },
    { id: 7, bookId: 7, user: "Meraklı", title: "Sapiens ve Tarım", body: "Tarım devrimi bir tuzak mıydı?", likes: 67, time: "2 gün önce", comments: [] },
    { id: 8, bookId: 16, user: "Girişimci", title: "Steve Jobs Vizyonu", body: "Apple'ı kurtarma süreci efsane.", likes: 44, time: "3 gün önce", comments: [] }
];

function forumuYukle() {
    const veriler = JSON.parse(localStorage.getItem('forumData'));
    const forumDiv = document.getElementById('forum-akisi');
    forumDiv.innerHTML = "";

    veriler.forEach(post => {
        const basHarf = post.user.charAt(0);
        // GÜNCELLEME: Forum postları için de 'article' kullanıldı.
        const postHTML = `
            <article class="forum-post" onclick="forumDetayAc(${post.id})"> 
                <div class="post-header">
                    <div class="avatar">${basHarf}</div>
                    <div>
                        <div class="user-name">${post.user}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <div class="post-title">${post.title}</div>
                <div class="post-content">${post.body.substring(0, 120)}...</div>
                <div class="post-footer">
                    <div class="stat"><span class="material-icons" style="font-size:16px">thumb_up</span> ${post.likes}</div>
                    <div class="stat"><span class="material-icons" style="font-size:16px">mode_comment</span> ${post.comments.length}</div>
                </div>
            </article>
        `;
        forumDiv.innerHTML += postHTML;
    });
}

function forumDetayAc(konuId) {
    aktifForumKonuId = konuId;
    const veriler = JSON.parse(localStorage.getItem('forumData'));
    const konu = veriler.find(k => k.id === konuId);
    if (!konu) return;

    sayfaDegistir('forum-detay'); 

    const baslikAlan = document.getElementById('detay-konu-baslik');
    baslikAlan.innerHTML = `
        <h2>${konu.title}</h2>
        <div class="post-header">
            <div class="avatar">${konu.user.charAt(0)}</div>
            <div>
                <div class="user-name">${konu.user}</div>
                <div class="post-time">${konu.time}</div>
            </div>
        </div>
    `;

    const anaGonderi = document.getElementById('ana-gonderi-alani');
    anaGonderi.innerHTML = `
        <div class="detay-content">${konu.body}</div>
        <div class="detay-post-footer">
            <button class="btn-kitap-incele-detay" onclick="magazayaGitVeAc(${konu.bookId})">
                <span class="material-icons" style="font-size:18px">book</span> İlgili Kitabı İncele
            </button>
        </div>
    `;

    const kitap = globalKitaplar.find(k => k.id === konu.bookId);
    const kitapKart = document.getElementById('ilgili-kitap-kart');
    if (kitap) {
        kitapKart.innerHTML = `
            <h3>📚 Tartışılan Kitap</h3>
            <img src="${kitap.image}" alt="${kitap.title}" onerror="this.src='https://placehold.co/150x220?text=Resim+Yok'" style="width:100px; height:150px; object-fit:cover; margin:10px auto; display:block; border-radius:8px;">
            <p style="font-weight:bold; text-align:center; margin-bottom:5px;">${kitap.title}</p>
            <p style="text-align:center; font-size:14px; color:#64748b;">${kitap.author}</p>
            <button onclick="detayAc(${kitap.id}); sayfaDegistir('magaza')" class="btn-sidebar-git" style="width:100%;">Detayları Gör</button>
        `;
    } else {
        kitapKart.innerHTML = `<h3>İlgili Kitap Bulunamadı</h3>`;
    }

    yorumlariGoster(konu);
}

function yorumlariGoster(konu) {
    const yorumContainer = document.getElementById('yorum-listesi-container');
    document.getElementById('yorum-sayisi').innerText = konu.comments.length;

    let yorumlarHTML = '';
    konu.comments.forEach(yorum => {
        const yorumAvatar = yorum.user.charAt(0);
        yorumlarHTML += `
            <div class="yorum-kart">
                <div class="yorum-avatar">${yorumAvatar}</div>
                <div class="yorum-body">
                    <div class="yorum-header">
                        <strong>${yorum.user}</strong>
                        <small>${yorum.time}</small>
                    </div>
                    <div class="yorum-text">${yorum.text}</div>
                </div>
            </div>
        `;
    });
    
    yorumContainer.innerHTML = yorumlarHTML;
    if (konu.comments.length === 0) {
         yorumContainer.innerHTML = "<p style='text-align:center; color:#94a3b8;'>Bu konuya henüz yorum yapılmadı. İlk yorumu sen yap!</p>";
    }
}

function yorumGonder() {
    const isimInput = document.getElementById('yorum-isim');
    const metinInput = document.getElementById('yorum-metni');
    const isim = isimInput.value.trim();
    const metin = metinInput.value.trim();

    // JS ile ek doğrulama
    if (!isim || !metin) {
        alert("Lütfen adınızı ve yorum metninizi giriniz.");
        return;
    }

    const veriler = JSON.parse(localStorage.getItem('forumData'));
    const aktifKonuIndex = veriler.findIndex(k => k.id === aktifForumKonuId);

    if (aktifKonuIndex > -1) {
        const yeniYorum = { user: isim, text: metin, time: "Şimdi" };
        veriler[aktifKonuIndex].comments.push(yeniYorum);
        localStorage.setItem('forumData', JSON.stringify(veriler));
        yorumlariGoster(veriler[aktifKonuIndex]);
        isimInput.value = "";
        metinInput.value = "";
    }
}

function magazayaGitVeAc(id) {
    magazayiSifirlaVeAc(); 
    setTimeout(() => { detayAc(id); }, 100);
}

function favorileriGoster() {
    sayfaDegistir('magaza'); 
    const favoriIdleri = JSON.parse(localStorage.getItem('favoriler')) || [];
    const favoriKitaplar = globalKitaplar.filter(kitap => favoriIdleri.includes(kitap.id));
    listeBaslik.innerText = "⭐ Favori Kitaplarım";
    listeBaslik.style.display = "block";
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('aktif'));
    listeyiEkranaBas(favoriKitaplar);
}

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