"use strict";
const doc=document.documentElement,themeButton=document.getElementById('theme-toggle'),media=matchMedia('(prefers-color-scheme: dark)');
let saved;try{saved=localStorage.getItem('lumoren-theme')}catch{}
function theme(value){doc.dataset.theme=value;themeButton.setAttribute('aria-label',value==='dark'?'切换到浅色模式':'切换到深色模式');themeButton.textContent=value==='dark'?'☀':'◐'}
theme(saved==='light'||saved==='dark'?saved:(media.matches?'dark':'light'));
themeButton.addEventListener('click',()=>{saved=doc.dataset.theme==='dark'?'light':'dark';theme(saved);try{localStorage.setItem('lumoren-theme',saved)}catch{}});
media.addEventListener('change',e=>{if(!saved)theme(e.matches?'dark':'light')});
const toggle=document.getElementById('menu-toggle'),nav=document.getElementById('navigation');
function closeMenu(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','打开导航');toggle.textContent='☰'}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'关闭导航':'打开导航');toggle.textContent=open?'×':'☰'});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus()}});
const reduce=matchMedia('(prefers-reduced-motion: reduce)'),sections=[...document.querySelectorAll('[data-reveal]')];
if(!reduce.matches&&'IntersectionObserver'in window){doc.classList.add('js');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.08});sections.forEach(s=>observer.observe(s));reduce.addEventListener('change',e=>{if(e.matches){sections.forEach(s=>s.classList.add('is-visible'));observer.disconnect()}})}
