// ========== FIREBASE BAŞLANGICI ==========
const firebaseConfig = {
  apiKey: "AIzaSyAJyigRXHdlHg15C79ajwijnFEj-aR12mU",
  authDomain: "sanaldavetiyelik-b6013.firebaseapp.com",
  databaseURL: "https://sanaldavetiyelik-b6013-default-rtdb.firebaseio.com",
  projectId: "sanaldavetiyelik-b6013",
  storageBucket: "sanaldavetiyelik-b6013.firebasestorage.app",
  messagingSenderId: "327145716165",
  appId: "1:327145716165:web:f9edac1d899c2fd1c8b3ac"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ========== TIKLAMA SAYACI ==========
function incrementClickCount(productCode) {
  db.ref('clicks/' + productCode).transaction(function(current) {
    return (current || 0) + 1;
  });
}

// ========== POPÜLERLİĞE GÖRE SIRALAMA + POPÜLER ROZETİ + PARILDAMA ==========
async function sortProductsByPopularity() {
  try {
    const snapshot = await db.ref('clicks').once('value');
    const clicks = snapshot.val() || {};

    const grid = document.getElementById('productGrid');
    const allCards = Array.from(grid.querySelectorAll('.product-card'));

    // Her ürüne tıklama sayısını ekle
    allCards.forEach(card => {
      const code = card.dataset.productCode;
      card._clickCount = clicks[code] || 0;
    });

    // Azalan sırada sırala (en popüler üstte)
    allCards.sort((a, b) => b._clickCount - a._clickCount);

    // Grid'deki sıralamayı güncelle
    allCards.forEach(card => grid.appendChild(card));

    // En popüler ürünü belirle (tıklama sayısı > 0 ise)
    const topCard = allCards[0];
    const topClicks = topCard._clickCount || 0;

    // Tüm kartlardan önceki popüler efektlerini temizle
    allCards.forEach(card => {
      card.classList.remove('popular-glow');
      const existingBadge = card.querySelector('.popular-badge');
      if (existingBadge) existingBadge.remove();
    });

    // Eğer en popüler üründe tıklama varsa işaretle
    if (topClicks > 0) {
      topCard.classList.add('popular-glow');

      // Eğer üründe "Popüler" rozeti yoksa ekle
      if (!topCard.querySelector('.popular-badge')) {
        const badge = document.createElement('span');
        badge.className = 'popular-badge';
        badge.textContent = 'Popüler';
        // Rozeti görselin olduğu kutuya ekle (product-img-box)
        const imgBox = topCard.querySelector('.product-img-box');
        if (imgBox) imgBox.appendChild(badge);
      }
    }
  } catch (e) {
    console.error('Firebase hatası:', e);
  }
}

// ========== ANA DOM YÜKLENİNCE ==========
document.addEventListener('DOMContentLoaded', () => {

    // ---------- HERO SLIDER ----------
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (slides.length > 0) {
        let currentIndex = 0;
        const totalSlides = slides.length;
        let autoInterval = null;
        const AUTO_DELAY = 4800;

        function updateSlider(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;
            slides.forEach((slide, i) => {
                slide.classList.remove('active', 'prev');
                if (i === currentIndex) slide.classList.add('active');
                else if (i === (currentIndex === 0 ? totalSlides - 1 : currentIndex - 1)) slide.classList.add('prev');
            });
            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        }
        
        function goToNext() { updateSlider(currentIndex + 1); resetAuto(); }
        function goToPrev() { updateSlider(currentIndex - 1); resetAuto(); }
        function goToSlide(index) { updateSlider(index); resetAuto(); }
        
        function startAuto() { 
            if (autoInterval) clearInterval(autoInterval); 
            autoInterval = setInterval(goToNext, AUTO_DELAY); 
        }
        
        function resetAuto() { 
            if (autoInterval) { 
                clearInterval(autoInterval); 
                autoInterval = setInterval(goToNext, AUTO_DELAY); 
            } 
        }
        
        if(nextBtn) nextBtn.addEventListener('click', goToNext);
        if(prevBtn) prevBtn.addEventListener('click', goToPrev);
        
        dots.forEach(dot => dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index, 10))));
        
        document.addEventListener('keydown', (e) => { 
            if (e.key === 'ArrowRight') goToNext(); 
            if (e.key === 'ArrowLeft') goToPrev(); 
        });
        
        updateSlider(0);
        startAuto();
    }

    // ---------- HEADER SCROLL ----------
    const header = document.getElementById('mainHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 30);
        }, { passive: true });
    }

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll('.reveal, .reveal-scale');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); 
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    revealElements.forEach(el => observer.observe(el));

    // ---------- SSS ACCORDION ----------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(other => { if (other !== item) other.classList.remove('active'); });
                item.classList.toggle('active');
            });
        }
    });

    // ---------- FOOTER ACCORDION ----------
    const accordionLinks = document.querySelectorAll('.accordion-link');
    accordionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;
            const content = document.getElementById(targetId);
            if (content) {
                document.querySelectorAll('.accordion-content').forEach(el => { if (el !== content) el.classList.remove('open'); });
                content.classList.toggle('open');
            }
        });
    });

    // ---------- WHATSAPP SİPARİŞ HATTI ----------
    const WHATSAPP_NO = '905386082155';

    // SİPARİŞ VER butonu (hem sayacı artır, hem WhatsApp'a yönlendir)
    document.querySelectorAll('.order-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const model = btn.dataset.kod;
            if (model) {
                incrementClickCount(model); // 👈 Sipariş tıklamasını da say
            }
            const msg = `Merhaba, web sitenizden ${model} kodlu tasarımı inceledim ve sipariş vermek istiyorum.`;
            window.open(`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    });
    
    const ideaBtn = document.getElementById('whatsappIdea');
    if (ideaBtn) {
        ideaBtn.addEventListener('click', () => {
            const msg = 'Merhaba, hayalimde çok farklı bir davetiye tasarımı var. Sizinle fikirlerimi paylaşıp özel bir çalışma yapmak istiyorum.';
            window.open(`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    }

    // ---------- ÖRNEĞİNE BAK (MODAL) ----------
    const modal = document.getElementById('previewModal');
    const modalIframe = document.getElementById('modalIframe');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    const exampleFileMap = {
        'SN-1': 'sn1/sn1.html', 'SN-2': 'sn2/sn2.html', 'SN-3': 'sn3/sn3.html',
        'SN-4': 'sn4/sn4.html', 'SN-5': 'sn5/sn5.html', 'SN-6': 'sn6/sn6.html',
        'SN-7': 'sn7/sn7.html', 'SN-8': 'sn8/sn8.html', 'SN-9': 'sn9/sn9.html',
        'SN-10': 'sn10/sn10.html', 'SN-11': 'sn11/sn11.html', 'SN-12': 'sn12/sn12.html'
    };
    
    function openModal(htmlFile) {
        if (!htmlFile || !modal || !modalIframe) return;
        modalIframe.src = htmlFile;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        if (!modal || !modalIframe) return;
        modal.classList.remove('show');
        setTimeout(() => {
            if (!modal.classList.contains('show')) modalIframe.src = '';
        }, 300);
        document.body.style.overflow = '';
    }
    
    // ÖRNEĞİNE BAK butonu (sayacı artır, modal aç)
    document.querySelectorAll('.example-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCode = btn.dataset.kod;
            if (productCode) {
                incrementClickCount(productCode); // 👈 Örnek tıklamasını say
            }
            const targetFile = exampleFileMap[productCode];
            if (targetFile) openModal(targetFile);
        });
    });
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.classList.contains('show')) closeModal(); });

    // ---------- FİLTRELEME + SAYFALAMA ----------
    const productGrid = document.getElementById('productGrid');
    const paginationContainer = document.getElementById('paginationContainer');
    const filterBtn = document.getElementById('filterBtn');
    const filterMenu = document.getElementById('filterMenu');
    const filterOptions = document.querySelectorAll('.filter-option');

    let currentCategory = 'all';
    let currentPage = 1;
    const productsPerPage = 6;

    function getFilteredProducts() {
        const allCards = Array.from(document.querySelectorAll('.product-card'));
        if (currentCategory === 'all') return allCards;
        return allCards.filter(card => card.dataset.category === currentCategory);
    }

    function renderPagination(filteredProducts) {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        paginationContainer.style.display = 'flex';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.classList.add('page-btn');
            if (i === currentPage) btn.classList.add('active');
            btn.dataset.page = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                renderProducts(filteredProducts);
                document.getElementById('ornekler').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            paginationContainer.appendChild(btn);
        }
    }

    function renderProducts(filteredProducts) {
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const visible = filteredProducts.slice(start, end);
        document.querySelectorAll('.product-card').forEach(card => card.style.display = 'none');
        visible.forEach(card => card.style.display = '');
        renderPagination(filteredProducts);
    }

    if (filterBtn && filterMenu) {
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterMenu.classList.toggle('active');
        });
    }

    filterOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            const cat = e.target.dataset.cat;
            currentCategory = cat;
            currentPage = 1;
            if (filterBtn) filterBtn.textContent = e.target.textContent + ' ▾';
            if (filterMenu) filterMenu.classList.remove('active');
            filterOptions.forEach(o => o.classList.remove('active'));
            e.target.classList.add('active');
            const filtered = getFilteredProducts();
            renderProducts(filtered);
        });
    });

    document.addEventListener('click', (e) => {
        if (filterMenu && !e.target.closest('.category-filter')) {
            filterMenu.classList.remove('active');
        }
    });

    // ---------- SAYFA YÜKLENDİĞİNDE POPÜLERLİK SIRALAMASI VE İLK RENDER ----------
    sortProductsByPopularity().then(() => {
        const initialFiltered = getFilteredProducts();
        renderProducts(initialFiltered);
    });

    // ---------- SONSuz KAYAN BANNER ----------
    document.querySelectorAll('.top-banner .banner-track').forEach(track => {
        if (track.dataset.cloned === 'true') return;
        const children = Array.from(track.children);
        children.forEach(child => {
            const clone = child.cloneNode(true);
            track.appendChild(clone);
        });
        track.dataset.cloned = 'true';
    });

    // ---------- WHATSAPP FLOAT (KANALLARA KAYDIR) ----------
    const whatsappFloat = document.getElementById('whatsappFloat');
    if (whatsappFloat) {
        whatsappFloat.addEventListener('click', function(e) {
            e.preventDefault();
            const kanallar = document.getElementById('siparisKanallari');
            if (kanallar) {
                kanallar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
})

// ================================================
// 📡 TELEGRAM ZİYARETÇİ BİLDİRİM SİSTEMİ (PREMIUM)
// ================================================

const TELEGRAM_BOT_TOKEN = '8816918684:AAG2k3MrtLGiMq_B-DMGKCg8SS3fKXVaz_8';
const TELEGRAM_CHAT_ID = '1088705141';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

const visitStart = Date.now();
let visitorData = null;
let pageHistory = []; // Gezilen sayfaları takip için

// IP ve konum bilgisi (çok detaylı)
async function fetchIpInfo() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return {
      ip: data.ip || 'Bilinmiyor',
      city: data.city || 'Bilinmiyor',
      region: data.region || 'Bilinmiyor',
      region_code: data.region_code || '',
      country: data.country_name || 'Bilinmiyor',
      country_code: data.country_code || '',
      continent: data.continent_code || '',
      postal: data.postal || '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      timezone: data.timezone || 'Bilinmiyor',
      utc_offset: data.utc_offset || '',
      isp: data.org || 'Bilinmiyor',
      asn: data.asn || '',
      is_eu: data.in_eu ? '✅ Evet' : '❌ Hayır',
      currency: data.currency || ''
    };
  } catch (e) {
    return null;
  }
}

// Detaylı cihaz/tarayıcı bilgisi
function getDeviceInfo() {
  const ua = navigator.userAgent;
  const isMobile = /Mobi|Android|iPhone/i.test(ua);
  const isTablet = /iPad|Tablet/i.test(ua);
  
  // Tarayıcı tespiti (daha detaylı)
  let browser = 'Bilinmiyor', browserVersion = '';
  if (ua.includes('Firefox')) { browser = 'Mozilla Firefox'; browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || ''; }
  else if (ua.includes('Edg')) { browser = 'Microsoft Edge'; browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || ''; }
  else if (ua.includes('Chrome') && !ua.includes('Edg')) { browser = 'Google Chrome'; browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || ''; }
  else if (ua.includes('Safari') && !ua.includes('Chrome')) { browser = 'Apple Safari'; browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || ''; }
  else if (ua.includes('OPR') || ua.includes('Opera')) { browser = 'Opera'; browserVersion = ua.match(/OPR\/([0-9.]+)/)?.[1] || ''; }
  
  // İşletim sistemi
  let os = 'Bilinmiyor', osVersion = '';
  if (ua.includes('Windows NT 10')) { os = 'Windows 10/11'; osVersion = 'NT 10.0'; }
  else if (ua.includes('Windows NT 6.3')) { os = 'Windows 8.1'; }
  else if (ua.includes('Windows NT 6.1')) { os = 'Windows 7'; }
  else if (ua.includes('Mac OS X')) { os = 'macOS'; osVersion = ua.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || ''; }
  else if (ua.includes('Android')) { os = 'Android'; osVersion = ua.match(/Android ([0-9.]+)/)?.[1] || ''; }
  else if (ua.includes('iPhone') || ua.includes('iPad')) { os = 'iOS'; osVersion = ua.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || ''; }
  else if (ua.includes('Linux')) { os = 'Linux'; }

  // Cihaz türü
  let deviceType = 'Masaüstü';
  if (isTablet) deviceType = 'Tablet';
  else if (isMobile) deviceType = 'Mobil Telefon';

  // Bağlantı türü
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const networkType = connection?.effectiveType || 'Bilinmiyor';
  const downlink = connection?.downlink || '?';
  const rtt = connection?.rtt || '?';

  return {
    browser: `${browser} ${browserVersion}`.trim(),
    os: `${os} ${osVersion}`.trim(),
    device: deviceType,
    screen: `${screen.width}x${screen.height} @ ${window.devicePixelRatio}x`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    languages: navigator.languages?.join(', ') || '',
    cookieEnabled: navigator.cookieEnabled ? '✅' : '❌',
    doNotTrack: navigator.doNotTrack || 'Belirtilmemiş',
    network: `${networkType.toUpperCase()} (${downlink} Mbps, RTT: ${rtt}ms)`,
    touchScreen: ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? '✅ Var' : '❌ Yok',
    referrer: document.referrer || 'Doğrudan giriş / Reklam',
    page: window.location.href,
    pageTitle: document.title
  };
}

// Ziyaretçinin site içi davranışı (opsiyonel)
function trackPageView() {
  pageHistory.push({
    url: window.location.href,
    title: document.title,
    time: new Date().toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })
  });
}

// Telegram'a mesaj gönder (emoji ve format zengin)
async function sendTelegramMessage(text) {
  try {
    await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      })
    });
  } catch (e) {
    console.error('Telegram gönderim hatası:', e);
  }
}

// Giriş bildirimi (ULTRA DETAYLI)
async function sendEntryNotification() {
  const ipInfo = await fetchIpInfo();
  const device = getDeviceInfo();
  visitorData = { ipInfo, device, pageHistory };
  trackPageView();

  const now = new Date().toLocaleString('tr-TR', { 
    timeZone: 'Europe/Istanbul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  // Harita linki (opsiyonel)
  const mapLink = ipInfo && ipInfo.latitude 
    ? `https://www.google.com/maps?q=${ipInfo.latitude},${ipInfo.longitude}` 
    : '';

  const msg = `
✨ <b>YENİ ZİYARETÇİ GİRİŞİ</b> ✨
━━━━━━━━━━━━━━━━━━━━━━━

🌍 <b>KONUM BİLGİLERİ</b>
   • IP Adresi: <code>${ipInfo?.ip || 'Alınamadı'}</code>
   • Şehir: ${ipInfo?.city || '?'}, ${ipInfo?.region || ''} ${ipInfo?.region_code ? '('+ipInfo.region_code+')' : ''}
   • Ülke: ${ipInfo?.country || '?'} ${ipInfo?.country_code || ''} ${ipInfo?.continent || ''}
   • Posta Kodu: ${ipInfo?.postal || '?'}
   • Koordinat: ${ipInfo?.latitude ? ipInfo.latitude+', '+ipInfo.longitude : '?'}
   ${mapLink ? `• Harita: <a href="${mapLink}">Google Maps'te Aç</a>` : ''}
   • Zaman Dilimi: ${ipInfo?.timezone || '?'} (UTC${ipInfo?.utc_offset || ''})
   • ISS / Organizasyon: ${ipInfo?.isp || '?'}
   • ASN: ${ipInfo?.asn || '?'}
   • AB Üyesi mi?: ${ipInfo?.is_eu || '?'}
   • Para Birimi: ${ipInfo?.currency || '?'}

📱 <b>CİHAZ & TARAYICI</b>
   • Tarayıcı: ${device.browser}
   • İşletim Sistemi: ${device.os}
   • Cihaz Türü: ${device.device} ${device.touchScreen.includes('Var') ? '(Dokunmatik)' : ''}
   • Ekran Çözünürlüğü: ${device.screen}
   • Görünen Alan: ${device.viewport}
   • Dil: ${device.language} (${device.languages})
   • Çerezler: ${device.cookieEnabled}
   • Do Not Track: ${device.doNotTrack}

🔌 <b>BAĞLANTI</b>
   • Ağ Tipi: ${device.network}

🔗 <b>KAYNAK & SAYFA</b>
   • Referans: ${device.referrer}
   • Giriş Sayfası: ${device.pageTitle}
   • URL: ${device.page}
   • Giriş Zamanı: ${now}

⏱️ <b>Ziyaret süresi hesaplanıyor...</b>
━━━━━━━━━━━━━━━━━━━━━━━
🟢 <b>Durum:</b> Çevrimiçi
`.trim();

  await sendTelegramMessage(msg);
}

// Çıkış bildirimi (süre ve sayfa geçmişiyle)
async function sendExitNotification() {
  if (!visitorData) return;
  const durationMs = Date.now() - visitStart;
  const sec = Math.floor(durationMs / 1000);
  const min = Math.floor(sec / 60);
  const remainSec = sec % 60;
  let durationStr;
  if (min > 60) {
    const hour = Math.floor(min / 60);
    const remainMin = min % 60;
    durationStr = `${hour} saat ${remainMin} dk`;
  } else if (min > 0) {
    durationStr = `${min} dk ${remainSec} sn`;
  } else {
    durationStr = `${sec} sn`;
  }

  trackPageView(); // çıkış anını da ekle
  const now = new Date().toLocaleString('tr-TR', { 
    timeZone: 'Europe/Istanbul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

  // Gezilen sayfaları listele
  let pageList = '';
  if (visitorData.pageHistory && visitorData.pageHistory.length > 0) {
    pageList = '\n📜 <b>GEZİLEN SAYFALAR</b>\n';
    visitorData.pageHistory.forEach((p, i) => {
      pageList += `   ${i+1}. ${p.title} - ${p.time}\n   <code>${p.url}</code>\n`;
    });
  }

  const msg = `
🔴 <b>ZİYARETÇİ AYRILDI</b> 🔴
━━━━━━━━━━━━━━━━━━━━━━━

🌐 <b>IP:</b> <code>${visitorData.ipInfo?.ip || '?'}</code>
📍 ${visitorData.ipInfo?.city || '?'}, ${visitorData.ipInfo?.country || '?'}

⏱ <b>Sitede Geçirilen Süre:</b> ${durationStr}
🕒 <b>Çıkış Zamanı:</b> ${now}
📄 <b>Çıkış Sayfası:</b> ${document.title}
🔗 <code>${window.location.href}</code>
${pageList}
━━━━━━━━━━━━━━━━━━━━━━━
📊 <b>Özet:</b> ${visitorData.device?.browser || '?'} / ${visitorData.device?.os || '?'} kullanıcısı ${durationStr} kaldı.
`.trim();

  const url = `${TELEGRAM_API}/sendMessage`;
  const body = JSON.stringify({
    chat_id: TELEGRAM_CHAT_ID,
    text: msg,
    parse_mode: 'HTML',
    disable_web_page_preview: false
  });
  navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
}

// Sayfa değişikliklerini de yakala (opsiyonel)
window.addEventListener('popstate', trackPageView);
window.addEventListener('hashchange', trackPageView);

// Başlat
document.addEventListener('DOMContentLoaded', () => {
  sendEntryNotification();
  window.addEventListener('beforeunload', () => {
    sendExitNotification();
  });
});
