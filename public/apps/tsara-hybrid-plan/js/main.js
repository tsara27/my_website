// Day tracker state
const completedDays = new Set();
const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

function toggleDay(dayKey) {
  const card = document.getElementById(`day-${dayKey}`);
  if (!card) return;

  const btn = card.querySelector('.check-toggle');
  const icon = btn.querySelector('.icon-state');
  const text = btn.querySelector('.btn-text');

  if (completedDays.has(dayKey)) {
    completedDays.delete(dayKey);
    card.classList.remove('border-brand-magenta', 'bg-brand-card/70', 'ring-1', 'ring-brand-magenta');
    btn.classList.remove('bg-brand-magenta', 'text-white', 'border-brand-magenta');
    btn.classList.add('border-brand-border', 'text-gray-300');
    icon.className = 'ph ph-circle text-sm icon-state';
    text.textContent = 'Done';
  } else {
    completedDays.add(dayKey);
    card.classList.add('border-brand-magenta', 'ring-1', 'ring-brand-magenta');
    btn.classList.add('bg-brand-magenta', 'text-white', 'border-brand-magenta');
    btn.classList.remove('border-brand-border', 'text-gray-300');
    icon.className = 'ph-bold ph-check-circle text-sm icon-state';
    text.textContent = 'Finished';
  }

  updateCounter();
}

function updateCounter() {
  const counterEl = document.getElementById('completedCount');
  if (counterEl) {
    counterEl.textContent = completedDays.size;
  }
}

function resetProgress() {
  completedDays.forEach(day => {
    const card = document.getElementById(`day-${day}`);
    if (card) {
      const btn = card.querySelector('.check-toggle');
      const icon = btn.querySelector('.icon-state');
      const text = btn.querySelector('.btn-text');

      card.classList.remove('border-brand-magenta', 'ring-1', 'ring-brand-magenta');
      btn.classList.remove('bg-brand-magenta', 'text-white', 'border-brand-magenta');
      btn.classList.add('border-brand-border', 'text-gray-300');
      icon.className = 'ph ph-circle text-sm icon-state';
      text.textContent = 'Done';
    }
  });
  completedDays.clear();
  updateCounter();
}

function filterDays(filter) {
  // Update filter button visuals
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.classList.remove('bg-brand-magenta', 'text-white');
    btn.classList.add('bg-brand-card', 'border', 'border-brand-border', 'text-gray-300');
  });

  const activeBtn = document.getElementById(`filter-${filter}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-brand-card', 'border-brand-border', 'text-gray-300');
    activeBtn.classList.add('bg-brand-magenta', 'text-white');
  }

  const cards = document.querySelectorAll('.day-card');
  cards.forEach(card => {
    const category = card.getAttribute('data-category');
    if (filter === 'all' || category === filter) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}
