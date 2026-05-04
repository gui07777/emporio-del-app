/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── REVEAL ON SCROLL ─── */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revealObs.unobserve(e.target); } });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

/* ─── LIVE STATUS BAR ─── */
function updateLiveStatus() {
    const now = new Date();
    const day = now.getDay();   // 0=Sun, 1=Mon … 6=Sat
    const hour = now.getHours();
    const min = now.getMinutes();
    const time = hour + min / 60;

    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const dayName = dayNames[day];

    let open = false;
    let closes = '';

    if (day >= 1 && day <= 5) { open = time >= 8 && time < 19; closes = '19h00'; }
    else if (day === 6) { open = time >= 9 && time < 16; closes = '16h00'; }
    else { open = time >= 9 && time < 13; closes = '13h00'; }

    const dot = document.getElementById('live-dot');
    const text = document.getElementById('live-text');

    if (open) {
        dot.style.background = '#5a9a34';
        text.innerHTML = `<strong>Estamos abertos agora</strong> — ${dayName} · Fechamos às ${closes}`;
    } else {
        dot.style.background = '#c0392b';
        dot.style.animation = 'none';
        let nextInfo = '';
        if (day >= 1 && day <= 4) nextInfo = 'Abrimos amanhã às 8h00';
        else if (day === 5) nextInfo = 'Sábado abrimos às 9h00';
        else if (day === 6) nextInfo = 'Domingo abrimos às 9h00';
        else nextInfo = 'Segunda abrimos às 8h00';
        text.innerHTML = `<strong>Fechado no momento</strong> — ${dayName} · ${nextInfo}`;
    }

    /* update table status cells dynamically */
    const rows = document.querySelectorAll('.hours-table tbody tr');
    const schedule = [
        { days: [1, 2, 3, 4, 5], open: 8, close: 19 },
        { days: [6], open: 9, close: 16 },
        { days: [0], open: 9, close: 13 }
    ];
    rows.forEach((row, idx) => {
        const rowDays = idx < 5 ? [1, 2, 3, 4, 5] : (idx === 5 ? [6] : [0]);
        const relevantDay = rowDays[0];
        const match = schedule.find(s => s.days.includes(relevantDay));
        const isToday = rowDays.includes(day);
        const statusEl = row.querySelector('.status-dot');
        if (!match || !statusEl) return;
        if (isToday && open) {
            statusEl.textContent = 'Aberto agora';
            statusEl.className = 'status-dot status-open';
            row.style.background = 'rgba(90,154,52,.04)';
        } else if (isToday && !open) {
            statusEl.textContent = 'Fechado';
            statusEl.className = 'status-dot status-close';
        } else {
            statusEl.textContent = 'Aberto';
            statusEl.className = 'status-dot status-open';
        }
    });
}

updateLiveStatus();
setInterval(updateLiveStatus, 60000);