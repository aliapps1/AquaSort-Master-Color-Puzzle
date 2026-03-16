// موتور صوتی اصلاح شده برای صدای طبیعی‌تر جابجایی آب
function playPourSound() {
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    // صدای حبابی و مایع گونه
    osc.type = 'sine'; 
    osc.frequency.setValueAtTime(400, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}

// تابع جابجایی اصلاح شده برای اطمینان از پخش صدا در هر حرکت
function handleTubeClick(i) {
    if (selectedIndex === null) {
        if (tubesData[i].length > 0) {
            selectedIndex = i;
            initAudio(); // اطمینان از فعال بودن موتور صوتی در هر کلیک
        }
    } else {
        if (selectedIndex !== i) {
            const from = tubesData[selectedIndex];
            const to = tubesData[i];
            
            if (from.length > 0) {
                const color = from[from.length - 1];
                if (to.length < 4 && (to.length === 0 || to[to.length - 1] === color)) {
                    
                    // ذخیره تاریخچه
                    moveHistory.push(JSON.stringify(tubesData));
                    
                    // پخش صدای جابجایی آب (حتماً اینجا اجرا می‌شود)
                    playPourSound(); 

                    while (from.length > 0 && from[from.length - 1] === color && to.length < 4) {
                        to.push(from.pop());
                    }
                    
                    if (checkWin()) {
                        playWinSound();
                        saveProgress();
                        setTimeout(() => {
                            document.getElementById('win-modal').style.display = 'flex';
                        }, 500);
                    }
                }
            }
        }
        selectedIndex = null;
    }
    render();
}
