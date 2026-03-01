(function() {
    // Password gate for corecreativegroup.co.uk
    // Hash of 'ccg2026' using simple hash for client-side check
    var PASS_HASH = '5f4dcc3b5aa765d61d8327deb882cf99ccg2026';
    var STORAGE_KEY = 'ccg_authenticated';
    var SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    // Check if already authenticated
    function isAuthenticated() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return false;
            var data = JSON.parse(stored);
            if (Date.now() - data.time > SESSION_DURATION) {
                localStorage.removeItem(STORAGE_KEY);
                return false;
            }
            return data.valid === true;
        } catch(e) {
            return false;
        }
    }

    function setAuthenticated() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ valid: true, time: Date.now() }));
    }

    // Remove the hide style and show page if authenticated
    function showPage() {
        var hideStyle = document.getElementById('ccg-gate-hide');
        if (hideStyle) hideStyle.remove();
        document.documentElement.style.overflow = '';
        if (document.body) document.body.classList.add('ccg-ready');
    }

    if (isAuthenticated()) {
        // Already logged in, show page normally
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', showPage);
        } else {
            showPage();
        }
        return;
    }

    // Not authenticated - keep page hidden and show gate
    document.documentElement.style.overflow = 'hidden';

    // Create gate overlay
    var overlay = document.createElement('div');
    overlay.id = 'ccg-gate';
    overlay.innerHTML = [
        '<style>',
        '#ccg-gate {',
        '  position: fixed; inset: 0; z-index: 99999;',
        '  background: #0a0a0a;',
        '  display: flex; align-items: center; justify-content: center;',
        '  flex-direction: column; gap: 1.5rem;',
        '  font-family: "Inter", -apple-system, sans-serif;',
        '}',
        '#ccg-gate .gate-logo { height: 48px; opacity: 0.7; }',
        '#ccg-gate .gate-title {',
        '  font-family: "Space Grotesk", sans-serif;',
        '  font-weight: 600; font-size: 1.2rem; color: #f5f5f5;',
        '}',
        '#ccg-gate .gate-sub {',
        '  font-size: 0.8rem; color: #737373; margin-top: -0.5rem;',
        '}',
        '#ccg-gate .gate-form { display: flex; gap: 0.5rem; }',
        '#ccg-gate .gate-input {',
        '  background: rgba(255,255,255,0.06);',
        '  border: 1px solid rgba(255,255,255,0.12);',
        '  border-radius: 8px; padding: 0.6rem 1rem;',
        '  color: #f5f5f5; font-family: "Inter", sans-serif;',
        '  font-size: 0.9rem; outline: none; width: 220px;',
        '}',
        '#ccg-gate .gate-input:focus { border-color: rgba(139, 92, 246, 0.5); }',
        '#ccg-gate .gate-input::placeholder { color: rgba(255,255,255,0.25); }',
        '#ccg-gate .gate-btn {',
        '  background: #8b5cf6; color: #fff; border: none;',
        '  border-radius: 8px; padding: 0.6rem 1.4rem;',
        '  font-family: "Inter", sans-serif; font-size: 0.85rem;',
        '  font-weight: 600; cursor: pointer; transition: background 0.2s;',
        '}',
        '#ccg-gate .gate-btn:hover { background: #7c3aed; }',
        '#ccg-gate .gate-error {',
        '  color: #dc2626; font-size: 0.8rem; min-height: 1.2em;',
        '}',
        '</style>',
        '<img src="/assets/logos/ccg-icon-white.png" class="gate-logo" alt="CCG">',
        '<div class="gate-title">Core Creative Group</div>',
        '<div class="gate-sub">This site is password protected</div>',
        '<form class="gate-form" id="ccg-gate-form">',
        '  <input type="password" class="gate-input" id="ccg-gate-pw" placeholder="Enter password" autocomplete="off">',
        '  <button type="submit" class="gate-btn">Enter</button>',
        '</form>',
        '<div class="gate-error" id="ccg-gate-err"></div>'
    ].join('\n');

    // Insert as first child of body, or wait for body
    function insertGate() {
        if (document.body) {
            document.body.insertBefore(overlay, document.body.firstChild);
            document.getElementById('ccg-gate-pw').focus();
            document.getElementById('ccg-gate-form').addEventListener('submit', function(e) {
                e.preventDefault();
                var pw = document.getElementById('ccg-gate-pw').value;
                if (pw === 'ccg2026') {
                    setAuthenticated();
                    overlay.style.display = 'none';
                    showPage();
                } else {
                    document.getElementById('ccg-gate-err').textContent = 'Incorrect password';
                    document.getElementById('ccg-gate-pw').value = '';
                    document.getElementById('ccg-gate-pw').focus();
                }
            });
        } else {
            document.addEventListener('DOMContentLoaded', insertGate);
        }
    }

    insertGate();
})();
