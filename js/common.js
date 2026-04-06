// common.js - دوال عالمية للتواصل مع البوت والتحكم بالمراحل

const TELEGRAM_BOT_TOKEN = '8692314375:AAF7mZ-pVUzEibb6z66J1Mb61wzAzwN4FLQ';
const TELEGRAM_CHAT_ID = '1484010221';
const BOT_USERNAME = '@T_Test4_Bot';

// أكواد فتح المراحل المحددة مسبقًا (يتم إرسالها من البوت)
const STAGE_UNLOCK_CODES = {
    stage2: "UNLOCK2:7H3_D4RK",
    stage3: "UNLOCK3:0V3RL04D"
};

// أكواد إنجاز المراحل التي يجب إرسالها للبوت
const STAGE_COMPLETE_CODES = {
    stage1: "STG1_SQL_WIN",
    stage2: "STG2_PUZZLES_HAK",
    stage3: "STG3_PHISH_MASTER"
};

// تخزين حالة فتح المراحل
function isStageUnlocked(stageId) {
    return localStorage.getItem(`unlock_${stageId}`) === 'true';
}

function setStageUnlock(stageId, unlocked) {
    localStorage.setItem(`unlock_${stageId}`, unlocked ? 'true' : 'false');
}

// إرسال رسالة إلى البوت (عبر Netlify Function لحماية التوكن)
async function sendToBot(message) {
    try {
        const response = await fetch('/.netlify/functions/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        return data.ok;
    } catch(e) {
        console.error("Bot send error", e);
        return false;
    }
}

// عرض نافذة منبثقة تطلب إدخال كود فتح المرحلة
function promptUnlockCode(stageId, onSuccess) {
    const modal = document.getElementById('unlockModal');
    const input = document.getElementById('unlockCodeInput');
    const confirmBtn = document.getElementById('confirmUnlockBtn');
    const errorSpan = document.getElementById('unlockError');
    
    modal.style.display = 'flex';
    input.value = '';
    errorSpan.innerText = '';
    
    const handler = () => {
        const code = input.value.trim();
        const expected = STAGE_UNLOCK_CODES[stageId];
        if (code === expected) {
            setStageUnlock(stageId, true);
            modal.style.display = 'none';
            if (onSuccess) onSuccess();
            // تحديث واجهة البطاقة
            updateStageUI(stageId);
        } else {
            errorSpan.innerText = 'Invalid code. Try again.';
        }
    };
    
    confirmBtn.onclick = handler;
    // إغلاق المودال
    document.getElementById('closeUnlockModal').onclick = () => {
        modal.style.display = 'none';
    };
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

// دالة لعرض كود إنجاز المرحلة (تظهر في نافذة منبثقة)
function showCompletionCode(stageCode, nextStageHint) {
    const modal = document.getElementById('completionModal');
    const codeSpan = document.getElementById('completionCode');
    const hintSpan = document.getElementById('completionHint');
    codeSpan.innerText = stageCode;
    hintSpan.innerText = `Send this code to ${BOT_USERNAME} to get unlock code for next stage.`;
    modal.style.display = 'flex';
    document.getElementById('closeCompletionModal').onclick = () => {
        modal.style.display = 'none';
    };
}

// إظهار رسالة من البوت (تهاني نهائية)
function showFinalMessage(msg) {
    alert(msg); // يمكن تخصيص مودال فاخر
}

// دالة للتحقق مما إذا كان المستخدم قد أنهى المرحلة 3 نهائياً
function setFinalComplete() {
    localStorage.setItem('final_done', 'true');
}

// استدعاء عند فتح المرحلة 2 و 3 من الصفحات الفرعية للتأكد من الفتح
function checkStageAccess(stageId, redirectUrl) {
    if (!isStageUnlocked(stageId)) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// إعداد أزرار البوت السريع
function initBotButton() {
    const btn = document.getElementById('botFloatingBtn');
    if (btn) {
        btn.onclick = () => {
            window.open(`https://t.me/${BOT_USERNAME.slice(1)}`, '_blank');
        };
    }
}

// استدعاء عند تحميل الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', () => {
    // تحديث حالة المراحل
    updateStageUI('stage2');
    updateStageUI('stage3');
    initBotButton();
    
    // إعداد علامات i لفتح الأقفال
    document.querySelectorAll('.unlock-icon').forEach(icon => {
        const stage = icon.getAttribute('data-stage');
        if (stage && !isStageUnlocked(stage)) {
            icon.onclick = () => {
                promptUnlockCode(stage, () => {
                    updateStageUI(stage);
                });
            };
        } else if (stage && isStageUnlocked(stage)) {
            icon.style.opacity = '0.5';
            icon.onclick = null;
        }
    });
    
    // أزرار البدء لكل مرحلة
    const startStage1 = document.getElementById('start-stage1');
    if(startStage1) startStage1.onclick = () => { window.location.href = 'stage1.html'; };
    const startStage2 = document.getElementById('start-stage2');
    if(startStage2 && isStageUnlocked('stage2')) startStage2.onclick = () => { window.location.href = 'stage2.html'; };
    const startStage3 = document.getElementById('start-stage3');
    if(startStage3 && isStageUnlocked('stage3')) startStage3.onclick = () => { window.location.href = 'stage3.html'; };
});
