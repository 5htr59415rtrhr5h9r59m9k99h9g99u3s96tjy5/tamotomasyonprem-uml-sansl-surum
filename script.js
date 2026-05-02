/* ============================================================
   script.js  –  Tüm işlevler + Animasyonlu modal
   YENİ: Müşteri Yorumları Slider + SAYFALAMA (Pagination)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- HERO SLIDER (mevcut) ----------
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
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
    function startAuto() { if (autoInterval) clearInterval(autoInterval); autoInterval = setInterval(goToNext, AUTO_DELAY); }
    function resetAuto() { if (autoInterval) { clearInterval(autoInterval); autoInterval = setInterval(goToNext, AUTO_DELAY); } }
    nextBtn.addEventListener('click', goToNext);
    prevBtn.addEventListener('click', goToPrev);
    dots.forEach(dot => dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index, 10))));
    document.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') goToNext(); if (e.key === 'ArrowLeft') goToPrev(); });
    updateSlider(0);
    startAuto();

    // ---------- HEADER SCROLL ----------
    const header = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 30));

    // ---------- SCROLL REVEAL ----------
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => observer.observe(el));

    // ---------- SSS ACCORDION ----------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(other => { if (other !== item) other.classList.remove('active'); });
            item.classList.toggle('active');
        });
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

    // ---------- WHATSAPP İŞLEMLERİ (Sipariş + Özel Fikir) ----------
    const WHATSAPP_NO = '905386082155';
    document.querySelectorAll('.order-btn').forEach(btn => {
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

    // ---------- ÖRNEĞİNE BAK (ANİMASYONLU MODAL) ----------
    const modal = document.getElementById('previewModal');
    const modalIframe = document.getElementById('modalIframe');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const exampleFileMap = {
        'SN-1': 'sn1/sn1.html',
        'SN-2': 'sn2/sn2.html',
        'SN-3': 'sn3/sn3.html',
        'SN-4': 'sn4/sn4.html',
        'SN-5': 'sn5/sn5.html',
        'SN-6': 'sn6/sn6.html',
        'SN-7': 'sn7/sn7.html',
        'SN-8': 'sn8/sn8.html',
        'SN-9': 'sn9/sn9.html',
        'SN-10': 'sn10/sn10.html',
        'SN-11': 'sn11/sn11.html',
        'SN-12': 'sn12/sn12.html'
    };
    function openModal(htmlFile) {
        if (!htmlFile) { console.warn('Örnek dosya tanımlı değil'); return; }
        modalIframe.src = htmlFile;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            if (!modal.classList.contains('show')) modalIframe.src = '';
        }, 400);
        document.body.style.overflow = '';
    }
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productCode = btn.dataset.kod;
            const targetFile = exampleFileMap[productCode];
            if (targetFile) openModal(targetFile);
            else alert(`${productCode} için örnek dosya bulunamadı.`);
        });
    });
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });

    // ========== SAYFALAMA (PAGINATION) ==========
    const productCards = document.querySelectorAll('.product-card');
    const paginationContainer = document.getElementById('paginationContainer');
    const productsPerPage = 6;  // İlk sayfada 6 ürün göster
    let currentPage = 1;
    const totalPages = Math.ceil(productCards.length / productsPerPage);

    function showPage(page) {
        // Tüm kartları gizle
        productCards.forEach((card, idx) => {
            const start = (page - 1) * productsPerPage;
            const end = start + productsPerPage;
            if (idx >= start && idx < end) {
                card.style.display = '';
                // Gizli kalmış kartların görünür olunca reveal tetiklenmesi için
                if (!card.classList.contains('visible')) {
                    // Observer tekrar tetikleyebilir, sorun yok
                    observer.observe(card);
                }
            } else {
                card.style.display = 'none';
            }
        });
        // Aktif buton stilini güncelle
        document.querySelectorAll('.page-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.page) === page) btn.classList.add('active');
        });
        currentPage = page;
    }

    function createPaginationButtons() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.classList.add('page-btn');
            if (i === currentPage) btn.classList.add('active');
            btn.dataset.page = i;
            btn.addEventListener('click', () => {
                showPage(i);
                // Sayfa değişince sayfanın başına yumuşak kaydır
                document.getElementById('ornekler').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            paginationContainer.appendChild(btn);
        }
    }

    if (totalPages > 1) {
        createPaginationButtons();
        showPage(1); // Başlangıçta ilk sayfayı göster
    } else {
        // Tek sayfa varsa tüm kartları göster
        productCards.forEach(card => card.style.display = '');
        if (paginationContainer) paginationContainer.style.display = 'none';
    }

    // ========== MÜŞTERİ YORUMLARI SLIDER ==========
    const reviewsTrack = document.getElementById('reviewsTrack');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevReviewBtn = document.getElementById('prevReview');
    const nextReviewBtn = document.getElementById('nextReview');
    const reviewsDotsContainer = document.getElementById('reviewsDots');

    if (reviewsTrack && reviewCards.length > 0) {
        const originalCards = Array.from(reviewCards);
        const totalOriginal = originalCards.length;

        // Klonları ekle: başa son kartın kopyası, sona ilk kartın kopyası
        const firstClone = originalCards[0].cloneNode(true);
        const lastClone = originalCards[totalOriginal - 1].cloneNode(true);
        reviewsTrack.appendChild(firstClone);
        reviewsTrack.insertBefore(lastClone, reviewsTrack.firstChild);

        let currentReviewIndex = 1;
        const totalSlidesReview = totalOriginal + 2;
        let cardWidthPercent = 100 / 3;
        let autoReviewInterval;
        const REVIEW_AUTO_DELAY = 4000;

        reviewsDotsContainer.innerHTML = '';
        for (let i = 0; i < totalOriginal; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.dataset.index = i;
            dot.addEventListener('click', () => goToReviewSlide(i + 1));
            reviewsDotsContainer.appendChild(dot);
        }

        function updateCardWidth() {
            if (window.innerWidth <= 480) {
                cardWidthPercent = 100;
            } else if (window.innerWidth <= 768) {
                cardWidthPercent = 50;
            } else {
                cardWidthPercent = 100 / 3;
            }
            const allCards = reviewsTrack.querySelectorAll('.review-card');
            allCards.forEach(card => {
                card.style.width = `calc(${cardWidthPercent}% - 12px)`;
            });
            setReviewTransform(false);
        }

        function setReviewTransform(animate = true) {
            if (!animate) reviewsTrack.style.transition = 'none';
            else reviewsTrack.style.transition = 'transform 0.5s ease';
            const translateX = -currentReviewIndex * cardWidthPercent;
            reviewsTrack.style.transform = `translateX(${translateX}%)`;
            if (!animate) {
                reviewsTrack.offsetHeight;
                reviewsTrack.style.transition = 'transform 0.5s ease';
            }
        }

        function updateReviewDots(realIndex) {
            const dots = reviewsDotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === realIndex);
            });
        }

        function goToReviewSlide(index) {
            currentReviewIndex = index;
            setReviewTransform(true);
            if (index === 0) {
                setTimeout(() => {
                    currentReviewIndex = totalOriginal;
                    setReviewTransform(false);
                    updateReviewDots(totalOriginal - 1);
                }, 500);
            } else if (index === totalSlidesReview - 1) {
                setTimeout(() => {
                    currentReviewIndex = 1;
                    setReviewTransform(false);
                    updateReviewDots(0);
                }, 500);
            } else {
                updateReviewDots(index - 1);
            }
            resetReviewAuto();
        }

        function nextReview() { goToReviewSlide(currentReviewIndex + 1); }
        function prevReview() { goToReviewSlide(currentReviewIndex - 1); }

        function startReviewAuto() {
            if (autoReviewInterval) clearInterval(autoReviewInterval);
            autoReviewInterval = setInterval(nextReview, REVIEW_AUTO_DELAY);
        }
        function resetReviewAuto() {
            if (autoReviewInterval) {
                clearInterval(autoReviewInterval);
                autoReviewInterval = setInterval(nextReview, REVIEW_AUTO_DELAY);
            }
        }

        nextReviewBtn.addEventListener('click', nextReview);
        prevReviewBtn.addEventListener('click', prevReview);

        let touchStartX = 0;
        let touchEndX = 0;
        reviewsTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            resetReviewAuto();
        }, { passive: true });
        reviewsTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextReview();
                else prevReview();
            }
            resetReviewAuto();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') nextReview();
            else if (e.key === 'ArrowLeft') prevReview();
        });

        updateCardWidth();
        window.addEventListener('resize', updateCardWidth);
        startReviewAuto();
    }

    // ---------- RESIZE (mevcut) ----------
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => { }, 200);
    });

});