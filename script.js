/* ============================================================
   script.js  –  Tam Güncel Sürüm (Filtre + Sayfalama + Slider + Modal + Accordion + WhatsApp)
   ============================================================ */

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
    document.querySelectorAll('.order-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const model = btn.dataset.kod;
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
        // Demo ürünler için şimdilik yok, sonra eklenebilir
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
    
    document.querySelectorAll('.example-btn:not([disabled])').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCode = btn.dataset.kod;
            const targetFile = exampleFileMap[productCode];
            if (targetFile) openModal(targetFile);
        });
    });
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal && modal.classList.contains('show')) closeModal(); });

    // ---------- FİLTRELEME + SAYFALAMA (GÜNCELLENMİŞ) ----------
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
        // Tüm kartları gizle
        document.querySelectorAll('.product-card').forEach(card => card.style.display = 'none');
        // Sadece görünür olanları göster
        visible.forEach(card => card.style.display = '');
        renderPagination(filteredProducts);
    }

    // Filtre butonuna tıklayınca menüyü aç/kapa
    if (filterBtn && filterMenu) {
        filterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filterMenu.classList.toggle('active');
        });
    }

    // Filtre seçeneğine tıklayınca
    filterOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            const cat = e.target.dataset.cat;
            currentCategory = cat;
            currentPage = 1;
            if (filterBtn) filterBtn.textContent = e.target.textContent + ' ▾';
            if (filterMenu) filterMenu.classList.remove('active');
            // Aktif sınıfını güncelle
            filterOptions.forEach(o => o.classList.remove('active'));
            e.target.classList.add('active');
            // Ürünleri yeniden filtrele ve göster
            const filtered = getFilteredProducts();
            renderProducts(filtered);
        });
    });

    // Sayfa dışına tıklayınca menüyü kapat
    document.addEventListener('click', (e) => {
        if (filterMenu && !e.target.closest('.category-filter')) {
            filterMenu.classList.remove('active');
        }
    });

    // Sayfa yüklendiğinde ilk gösterim (tümü)
    const initialFiltered = getFilteredProducts();
    renderProducts(initialFiltered);
});

// ---------- SONSuz KAYAN BANNER ----------
function setupInfiniteBanner() {
    document.querySelectorAll('.top-banner .banner-track').forEach(track => {
        if (track.dataset.cloned === 'true') return;
        const children = Array.from(track.children);
        children.forEach(child => {
            const clone = child.cloneNode(true);
            track.appendChild(clone);
        });
        track.dataset.cloned = 'true';
    });
}

document.addEventListener('DOMContentLoaded', setupInfiniteBanner);