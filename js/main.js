// 导航栏汉堡菜单
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});

// 点击导航链接后关闭菜单
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// ESC 关闭菜单
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});



// 点击服务卡片 - 跳转到表单并自动选择服务
function selectService(name) {
    const select = document.querySelector('select[name="service"]');
    if (select) {
        select.value = name;
    }
    // 平滑滚动到联系表单
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// 页面加载时检查URL参数，自动选择服务类型
window.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    if (service) {
        const select = document.querySelector('select[name="service"]');
        if (select) {
            select.value = service;
            setTimeout(function() {
                document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});

// 滚动时导航栏加深（节流）
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const navbar = document.querySelector('.navbar');
            navbar.classList.toggle('scrolled', window.scrollY > 50);
            ticking = false;
        });
        ticking = true;
    }
});


// 表单实时校验
const phoneInput = document.querySelector('input[name="phone"]');
if (phoneInput) {
phoneInput.addEventListener('input', function() {
    const val = this.value.replace(/\D/g, '');
    this.value = val;
    if (val.length === 11) {
        this.style.borderColor = '#2d6a4f';
    } else if (val.length > 0) {
        this.style.borderColor = '#ef4444';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});
}

// 表单提交
const form = document.getElementById('contactForm');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = this.querySelector('input[type="text"]').value.trim();
    const phone = this.querySelector('input[type="tel"]').value.trim();
    const service = this.querySelector('select').value;
    const desc = this.querySelector('textarea').value.trim();

    if (!name || !phone || !service) {
        showToast('请填写完整信息');
        return;
    }
    if (!/^1\d{10}$/.test(phone)) {
        showToast('请输入正确的11位手机号码');
        return;
    }

    const btn = this.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = '提交中...';
    showToast('正在提交...');

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('phone', phone);
    params.append('service', service);
    params.append('desc', desc);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    fetch('/api/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: params.toString(),
        signal: controller.signal
    })
    .then(r => r.json())
    .then(data => {
        if (data.feishu) {
            showToast('预约已提交，我们会尽快联系您！', true);
        } else {
            showToast('预约已记录', true);
        }
        document.getElementById('contactForm').reset();
    })
    .catch(() => {
        showToast('网络异常，请拨打 13582241674 电话预约');
        document.getElementById('contactForm').reset();
    });
});

// Toast 提示
function showToast(msg, isSuccess) {
    const old = document.querySelector('.toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'toast' + (isSuccess ? ' toast-success' : '');
    toast.innerHTML = (isSuccess ? '✅ ' : '') + msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}


// 数据统计数字动画
function animateCounters() {
    const stats = document.querySelectorAll('.stat .num');
    stats.forEach(el => {
        const target = parseInt(el.textContent.replace(/\D/g, ''));
        const suffix = el.textContent.replace(/[\d]/g, '');
        let current = 0;
        const steps = 40;
        const stepVal = target / steps;
        const timer = setInterval(() => {
            current += stepVal;
            if (current >= target) {
                el.textContent = target + suffix;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + suffix;
            }
        }, 25);
    });
}

// 使用 IntersectionObserver 触发数字动画
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) observer.observe(statsSection);
