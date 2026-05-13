// 导航栏汉堡菜单
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// 点击导航链接后关闭菜单
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// 滚动时导航栏加阴影
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.style.boxShadow = window.scrollY > 50
        ? '0 2px 20px rgba(0,0,0,.1)'
        : '0 1px 10px rgba(0,0,0,.06)';
});

// 表单提交
const form = document.getElementById('contactForm');
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = this.querySelector('input[type="text"]').value.trim();
    const phone = this.querySelector('input[type="tel"]').value.trim();
    const service = this.querySelector('select').value;

    if (!name || !phone || !service) {
        showToast('请填写完整信息');
        return;
    }

    // 弹出提示，可对接后端API
    showToast('预约已提交，我们会尽快联系您！');
    this.reset();
});

// Toast 提示
function showToast(msg) {
    const old = document.querySelector('.toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}
