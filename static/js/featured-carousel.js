document.addEventListener('DOMContentLoaded', function(){
  const carousel = document.querySelector('.carousel');
  const track = document.querySelector('.carousel-track');
  let slides = track ? Array.from(track.querySelectorAll('.carousel-slide')) : [];
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if(!carousel || !track) return;

  // Create dots container
  let dotsNav = document.createElement('div');
  dotsNav.className = 'carousel-dots';
  track.parentElement.appendChild(dotsNav);

  let currentIndex = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 5000; // 5s

  // Fetch featured recipes (fallback to existing DOM slides on failure)
  async function loadFeatured(){
    try{
      const res = await fetch('http://localhost:3002/recipes?_limit=10');
      if(!res.ok) throw new Error('Fetch failed');
      const items = await res.json();
      if(items && items.length){
        renderSlides(items);
        init();
        return;
      }
    }catch(e){
      // ignore and use static slides
    }
    // fallback
    slides = Array.from(track.querySelectorAll('.carousel-slide'));
    init();
  }

  function renderSlides(items){
    track.innerHTML = '';
    items.forEach(item =>{
      const li = document.createElement('li');
      li.className = 'carousel-slide';
      const article = document.createElement('article');
      article.className = 'recipe-card';

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = item.imageUrl || 'images/placeholder.svg';
      img.onerror = () => { img.onerror = null; img.src = 'images/placeholder.svg'; };
      img.alt = item.name || 'Recipe image';

      const overlay = document.createElement('div');
      overlay.className = 'overlay';

      const h3 = document.createElement('h3');
      h3.textContent = item.name || 'Untitled';

      const p = document.createElement('p');
      p.textContent = item.instructions ? truncate(item.instructions.replace(/\n/g, ' '), 120) : (item.category || 'Recipe');

      overlay.appendChild(h3);
      overlay.appendChild(p);

      article.appendChild(img);
      article.appendChild(overlay);
      li.appendChild(article);
      track.appendChild(li);
    });
    slides = Array.from(track.querySelectorAll('.carousel-slide'));
  }

  function truncate(str, n){
    return str.length > n ? str.slice(0, n-1) + '…' : str;
  }

  function initDots(){
    dotsNav.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Go to slide ${i+1}`);
      btn.addEventListener('click', () => moveToSlide(i));
      if(i===0) btn.classList.add('active');
      dotsNav.appendChild(btn);
    });
  }

  function updateDots(){
    const dots = dotsNav.querySelectorAll('button');
    dots.forEach((d, idx) => d.classList.toggle('active', idx===currentIndex));
  }

  function moveToSlide(index){
    if(slides.length === 0) return;
    const slideWidth = slides[0].getBoundingClientRect().width;
    // wrap-around
    currentIndex = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    updateDots();
  }

  function prev(){ moveToSlide(currentIndex-1); }
  function next(){ moveToSlide(currentIndex+1); }

  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  // Autoplay
  function startAutoplay(){
    stopAutoplay();
    autoplayTimer = setInterval(() => { next(); }, AUTOPLAY_INTERVAL);
  }
  function stopAutoplay(){ if(autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }

  // Pause on hover
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Recalculate on resize
  let resizeTimeout;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(()=> moveToSlide(currentIndex), 150);
  });

  function init(){
    if(!slides || slides.length === 0) return;
    initDots();
    updateDots();
    moveToSlide(0);
    startAutoplay();
  }

  // Start
  loadFeatured();

});
