// Dosya adı: script.js

/* 1. BAŞLANGIÇ: SAYFA HAZIR OLUNCA ÇALIŞ
   DOM (Belge Nesne Modeli) tamamen yüklendiğinde kodları çalıştırır.
   Böylece HTML elemanları oluşmadan onlara erişmeye çalışıp hata almayız.
*/
document.addEventListener('DOMContentLoaded', () => {
    // Sayfa ilk açıldığında kutu boştur (""). 
    // Boş parametre göndererek "Bütün kitapları getir" diyoruz.
    kitaplariGetir(""); 
});


/* 2. TANIMLAMALAR
   Sürekli kullanacağımız HTML elemanlarını seçip değişkenlere atıyoruz.
   Bu sayede her seferinde document.getElementById yazmak zorunda kalmıyoruz.
*/
const aramaInput = document.getElementById("aramaInput");
const listeDiv = document.getElementById('kitap-listesi');
const loader = document.getElementById('loader');


/* 3. KLAVYE DİNLEME (ENTER TUŞU)
   Kullanıcı arama kutusundayken bir tuşa bastığında bu çalışır.
   Eğer basılan tuş "Enter" ise aramayı başlatır.
*/
aramaInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        // Kutudaki değeri (value) al ve fonksiyona gönder.
        kitaplariGetir(aramaInput.value);
    }
});


/* 4. BUTON İÇİN TETİKLEYİCİ
   HTML'deki "ARA" butonuna basınca çalışacak fonksiyon.
*/
function aramayiBaslat() {
    kitaplariGetir(aramaInput.value);
}


/* 5. ANA FONKSİYON: KİTAPLARI GETİR VE FİLTRELE
   Hem veri çekme hem de arama işlemini yapan beynimiz burası.
   'async' diyoruz çünkü dosya okumak (fetch) zaman alan bir iştir.
*/
async function kitaplariGetir(arananKelime) {

    // Temizlik: Önceki aramadan kalan kitapları sil.
    listeDiv.innerHTML = "";
    // Kullanıcı beklerken dönen yükleme simgesini (loader) görünür yap.
    loader.style.display = "block";

    try {
        /* 6. VERİYİ ÇEKME (FETCH)
           Artık uzak sunucuya değil, yanındaki 'kitaplar.json' dosyasına gidiyoruz.
           'await': Dosya tamamen okunana kadar bekle.
        */
        const response = await fetch('kitaplar.json');
        
        /* 7. JSON ÇÖZÜMLEME
           Gelen dosya içeriğini JavaScript'in anlayacağı "Dizi" (Array) formatına çevir.
           'tumKitaplar' değişkeni artık içinde 10 tane kitap olan bir listedir.
        */
        const tumKitaplar = await response.json();

        // Veri geldi, artık loader'a gerek yok, gizle.
        loader.style.display = "none";


        /* 8. FİLTRELEME MANTIĞI (EN ÖNEMLİ KISIM)
           API kullanırken filtrelemeyi Google yapıyordu. Şimdi biz yapmalıyız.
           
           .filter(): Listeyi tarar, sadece şarta uyanları yeni listeye koyar.
           .toLowerCase(): Büyük/küçük harf duyarlılığını kaldırır (Arama = arama).
           .includes(): "İçeriyor mu?" kontrolü yapar.
        */
        const filtrelenmisKitaplar = tumKitaplar.filter(kitap => {
            // Kullanıcının yazdığını küçük harfe çevir (Örn: "Dostoyevski" -> "dostoyevski")
            const kelime = arananKelime.toLowerCase();
            
            // Kitap başlığını küçük harfe çevirip içinde aranan kelime var mı bak
            const baslikEslesti = kitap.title.toLowerCase().includes(kelime);
            
            // VEYA (||) Yazar adında geçiyor mu bak
            const yazarEslesti = kitap.author.toLowerCase().includes(kelime);

            // Eğer başlıkta VEYA yazarda varsa bu kitabı listeye al (true döndür)
            return baslikEslesti || yazarEslesti;
        });


        /* 9. SONUÇ YOKSA UYARI VER
           Filtreleme sonucu liste boş kaldıysa kullanıcıyı bilgilendir.
        */
        if (filtrelenmisKitaplar.length === 0) {
            listeDiv.innerHTML = "<h3 style='text-align:center; width:100%;'>Aradığınız kriterde kitap bulunamadı.</h3>";
            return; // Fonksiyonu burada bitir, aşağıya inme.
        }


        /* 10. EKRANA BASMA (RENDER)
           Elimizde kalan filtrelenmiş kitapları döngüye sokup HTML kartlarını oluşturuyoruz.
        */
        filtrelenmisKitaplar.forEach(kitap => {
            
            // HTML Şablonu (Template Literal)
            // JSON dosyasındaki anahtarları kullanıyoruz: kitap.image, kitap.title vb.
            const htmlKart = `
                <div class="kitap-karti">
                    <div class="img-container">
                        <img src="${kitap.image}" alt="${kitap.title}">
                    </div>
                    <div class="content">
                        <div class="title">${kitap.title}</div>
                        <div class="author">${kitap.author}</div>
                        <div class="price-tag">
                            ${kitap.price} ₺
                            <button class="btn-incele">İncele</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Oluşturulan kartı rafa ekle
            listeDiv.innerHTML += htmlKart;
        });

    } catch (error) {
        /* 11. HATA YÖNETİMİ
           Eğer 'kitaplar.json' dosyası bulunamazsa veya JSON formatı bozuksa burası çalışır.
        */
        console.error("Hata:", error);
        loader.style.display = "none";
        listeDiv.innerHTML = "<h3>Veri dosyası (kitaplar.json) okunamadı! Dosyanın doğru yerde olduğundan emin olun.</h3>";
    }
}