// *** 🚩 แก้ไขวันเกิดที่ถูกต้องที่นี่ ในรูปแบบ MM-DD (เดือน-วัน) 🚩 ***
// ตัวอย่าง: วันที่ 6 พฤศจิกายน (06/11)
const CORRECT_DAY_MONTH = "06-11";

// *** 🚩 แก้ไขลิงก์รูปภาพของคุณที่นี่ (ใช้ URL ออนไลน์) 🚩 ***
const IMAGE_URLS = [
    // เปลี่ยนกลับไปใช้ Placeholder URL
    "images/my_picture_1.jpg",
    "images/my_picture_2.jpg",
    "images/my_picture_3.jpg",
    "images/my_picture_4.jpg",
    "images/my_picture_5.jpg",
];


let isMainViewReady = false; 

/**
 * ตรวจสอบวันเกิดที่ผู้ใช้ป้อน
 */
function checkBirthday() {
    // 1. รับค่าและลบช่องว่าง
    const input = document.getElementById('birthdayInput').value.trim(); 
    const messageElement = document.getElementById('message');
    
    messageElement.textContent = "";

    if (!input) {
        messageElement.textContent = "กรุณาใส่วันเกิดก่อนนะคะ! (เช่น 06-11-2006)";
        messageElement.style.color = '#A80077';
        messageElement.style.backgroundColor = '#fff0f5';
        return;
    }

    // 2. ตรวจสอบและแยก DD-MM ออกจาก Input (รองรับตัวคั่น -, / หรือ .)
    const dateFormatRegex = /^(\d{2})[-\/.](\d{2})[-\/.](\d{4})$/;
    const match = input.match(dateFormatRegex);
    
    if (!match) {
        messageElement.textContent = "รูปแบบไม่ถูกต้อง! กรุณาใส่ วัน-เดือน-ปี (DD-MM-YYYY) เช่น 06-11-2006";
        messageElement.style.color = '#A80077';
        messageElement.style.backgroundColor = '#fff0f5';
        return;
    }
    
    // match[1] คือ วัน (DD), match[2] คือ เดือน (MM)
    const inputDayMonth = `${match[1]}-${match[2]}`; 

    // 3. ตรวจสอบกับวัน-เดือนที่ถูกต้อง
    if (inputDayMonth === CORRECT_DAY_MONTH) {
        messageElement.textContent = "ถูกต้อง! เตรียมตัวรับเซอร์ไพรส์!";
        messageElement.style.color = '#4CAF50';
        messageElement.style.backgroundColor = '#e8f5e9';

        setTimeout(() => {
            showMainView();
        }, 1000); 

    } else {
        messageElement.textContent = "วันเกิดยังไม่ถูกต้องนะ ลองอีกครั้ง! 😉";
        messageElement.style.color = '#A80077';
        messageElement.style.backgroundColor = '#fff0f5';
    }
}


/**
 * แสดงหน้าหลักของเซอร์ไพรส์
 */
function showMainView() {
    document.getElementById('login-view').style.display = 'none';
    document.getElementById('main-view').style.display = 'block';

    if (!isMainViewReady) {
        preloadImages(); 
        setupImageScroll();
        startConfettiEffect();
        isMainViewReady = true;
    }
}


/**
 * โหลดรูปภาพและแทรกลงใน DOM 
 */
function preloadImages() {
    const track = document.getElementById('image-track');
    if (!track) return;
    
    track.innerHTML = ''; 

    const allUrls = [...IMAGE_URLS, ...IMAGE_URLS];

    allUrls.forEach(url => {
        const item = document.createElement('div');
        item.className = 'track-item';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Birthday Surprise Picture';
        
        img.onerror = function() {
            this.src = `https://placehold.co/400x400/CCCCCC/333333?text=Error%20Loading%20Image`;
        };

        item.appendChild(img);
        track.appendChild(item);
    });
}


/**
 * ตั้งค่าการเลื่อนภาพอัตโนมัติ 
 */
function setupImageScroll() {
    const track = document.getElementById('image-track');
    if (!track) return;

    let position = 0;
    const speed = 0.5; // ความเร็วในการเลื่อน
    const imageWidth = 350; // ขนาดความกว้างของรูปภาพ
    const margin = 50; // ขนาด margin
    const itemFullWidth = imageWidth + margin;
    const totalImageCount = IMAGE_URLS.length; 
    const totalScrollWidth = totalImageCount * itemFullWidth; 

    function animateScroll() {
        position -= speed;
        
        if (position <= -totalScrollWidth) {
            position = 0;
        }

        track.style.transform = `translateX(${position}px)`;
        requestAnimationFrame(animateScroll);
    }

    animateScroll();
}

/**
 * เริ่มเอฟเฟกต์พลุ (Confetti) 
 */
function startConfettiEffect() {
    if (typeof confetti === 'function') {
        const duration = 15 * 1000; // 15 วินาที
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const time = Date.now();
            if (time > animationEnd) {
                return clearInterval(interval);
            }

            // ยิงจากซ้าย
            confetti(Object.assign({}, defaults, {
                particleCount: 2,
                origin: { x: randomInRange(0.1, 0.3), y: randomInRange(0.7, 0.9) }
            }));

            // ยิงจากขวา
            confetti(Object.assign({}, defaults, {
                particleCount: 2,
                origin: { x: randomInRange(0.7, 0.9), y: randomInRange(0.7, 0.9) }
            }));
        }, 500); // ยิงทุก 0.5 วินาที
    } else {
        console.warn("Confetti library not loaded.");
    }
}

// โหลดรูปภาพทันทีที่หน้าเว็บโหลดเสร็จ (ใช้สำหรับเตรียมการเลื่อนภาพล่วงหน้า)
window.onload = preloadImages;

