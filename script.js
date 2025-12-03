var html=document.documentElement;var themeToggle=document.getElementById('themeToggle');var menuBtn=document.querySelector('.menu-btn');var mobileMenu=document.getElementById('mobileMenu');var navLinks=document.querySelectorAll('a[href^="#"]');
var stored=localStorage.getItem('theme');if(stored){html.setAttribute('data-theme',stored)}
function toggleTheme(){var next=html.getAttribute('data-theme')==='dark'?'light':'dark';html.setAttribute('data-theme',next);localStorage.setItem('theme',next)}
if(themeToggle){themeToggle.addEventListener('click',toggleTheme)}
function toggleMenu(){var open=mobileMenu.style.display==='block';mobileMenu.style.display=open?'none':'block'}
if(menuBtn){menuBtn.addEventListener('click',toggleMenu)}
mobileMenu&&mobileMenu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mobileMenu.style.display='none'})});
navLinks.forEach(function(l){l.addEventListener('click',function(e){var id=l.getAttribute('href');if(id&&id.startsWith('#')){var el=document.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}}})});
