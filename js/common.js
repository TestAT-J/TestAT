// common.js - معتمد على البوت للرد بأكواد الفتح

const STAGE_UNLOCK_CODES = {
    stage2: "UNLOCK2:7H3_D4RK",
    stage3: "UNLOCK3:0V3RL04D"
};

// دوال التخزين المحلي
function isStageUnlocked(stageId) {
    return localStorage.getItem(`unlock_${stageId}`) === 'true';
}

function setStageUnlock(stageId, unlocked) {
    localStorage.setItem(`unlock_${stageId}`, unlocked ? 'true' : 'false');
}

function updateStageUI(stageId) {
    const card = document.getElementById(`stage-${stageId}`);
    if (!card) return;
    const unlockIcon = card.querySelector('.unlock-icon');
    const actionBtn = card.querySelector('.stage-action button');
    if (isStageUnlocked(stageId)) {
        card.classList.remove('locked');
        if (actionBtn) actionBtn.disabled = false;
        if (unlockIcon) unlockIcon.style.opacity = '0.5';
    } else {
        card.classList.add('locked');
        if (actionBtn) actionBtn.disabled = true;
        if (unlockIcon) unlockIcon.style.opacity = '1';
    }
}

// إرسال كود الإنجاز إلى البوت (عبر Netlify Function) والحصول على كود الفتح
async function sendCompletionToBot(completionCode, stageId) {
    try {
        const response = await fetch('/.netlify/functions/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: completionCode, chatId: '5828320239' })
        });
        const data = await response.json();
        if (data.ok && data.unlockCode) {
            // البوت رد بكود الفتح، نخزنه محلياً للمرحلة التالية
            let nextStage = '';
            if (stageId === 'stage1') nextStage = 'stage2';
            else if (stageId === 'stage2') nextStage = 'stage3';
            if (nextStage) {
                setStageUnlock(nextStage, true);
                alert(`✅ Stage completed! Unlock code received from bot.\n🔓 Next stage unlocked! Go back to main page.`);
                window.location.href = 'index.html';
            } else if (stageId === 'stage3') {
                alert(`🏆 Final stage completed! Check your Telegram for further instructions.`);
                window.location.href = 'index.html';
            }
        } else if (data.ok && !data.unlockCode) {
            alert(`✅ Code sent to bot. Check your Telegram for the unlock code.`);
        } else {
            alert(`❌ Failed: ${data.description || 'Unknown error'}. Try again or contact admin.`);
        }
    } catch (err) {
        alert('Network error. Make sure you are online and the site is deployed on Netlify.');
    }
}

// دوال لكل مرحلة لاستدعائها من صفحات التحديات
function completeStage1() {
    if (!localStorage.getItem('stage1_completed')) {
        localStorage.setItem('stage1_completed', 'true');
        sendCompletionToBot('STG1_SQL_WIN', 'stage1');
    } else {
        alert('Stage 1 already completed. Unlock code for stage 2: ' + STAGE_UNLOCK_CODES.stage2);
    }
}

function completeStage2() {
    if (!localStorage.getItem('stage2_completed')) {
        localStorage.setItem('stage2_completed', 'true');
        sendCompletionToBot('STG2_PUZZLES_HAK', 'stage2');
    } else {
        alert('Stage 2 already completed. Unlock code for stage 3: ' + STAGE_UNLOCK_CODES.stage3);
    }
}

function completeStage3() {
    if (!localStorage.getItem('stage3_completed')) {
        localStorage.setItem('stage3_completed', 'true');
        sendCompletionToBot('STG3_PHISH_MASTER', 'stage3');
    } else {
        alert('Stage 3 already completed.');
    }
}

// إعداد الصفحة الرئيسية
function initHomePage() {
    updateStageUI('stage2');
    updateStageUI('stage3');

    const botBtn = document.getElementById('botFloatingBtn');
    if (botBtn) {
        botBtn.onclick = () => window.open('https://t.me/T_Test4_Bot', '_blank');
    }

    document.querySelectorAll('.unlock-icon').forEach(icon => {
        const stage = icon.getAttribute('data-stage');
        if (stage && !isStageUnlocked(stage)) {
            icon.onclick = () => {
                const code = prompt(`Enter unlock code for ${stage.toUpperCase()}:`);
                const expected = STAGE_UNLOCK_CODES[stage];
                if (code === expected) {
                    setStageUnlock(stage, true);
                    updateStageUI(stage);
                    alert(`✅ ${stage} unlocked!`);
                } else if (code) {
                    alert('Invalid code.');
                }
            };
        } else if (stage && isStageUnlocked(stage)) {
            icon.style.opacity = '0.4';
            icon.onclick = null;
        }
    });

    const start1 = document.getElementById('start-stage1');
    if (start1) start1.onclick = () => window.location.href = 'stage1.html';
    
    const start2 = document.getElementById('start-stage2');
    if (start2 && isStageUnlocked('stage2')) {
        start2.disabled = false;
        start2.onclick = () => window.location.href = 'stage2.html';
    }
    
    const start3 = document.getElementById('start-stage3');
    if (start3 && isStageUnlocked('stage3')) {
        start3.disabled = false;
        start3.onclick = () => window.location.href = 'stage3.html';
    }
}

if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
    document.addEventListener('DOMContentLoaded', initHomePage);
}
