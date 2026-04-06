const canvas = document.getElementById("scroll-canvas");
const context = canvas.getContext("2d");

// Configuration for frame sequence
const frameCount = 192;
const currentFrame = (index) => {
    // Frames are 1-indexed, frontpadded with zeroes to 5 digits, e.g. 00001.jpg
    return `keyboard imgs/${index.toString().padStart(5, '0')}.jpg`;
};

// Set canvas dimensions
canvas.width = 1920;
canvas.height = 1080;

// Resize canvas dynamically to fit window while keeping aspect ratio
function resizeCanvas() {
    const windowRatio = window.innerWidth / window.innerHeight;
    const canvasRatio = canvas.width / canvas.height;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const preloadedImages = [];

// Preload the first frame immediately for quick render
const img = new Image();
img.src = currentFrame(1);
img.onload = () => {
    drawImageCover(context, img, canvas.width, canvas.height);
};

// Preload all remaining frames in the background
function preloadAllImages() {
    for (let i = 1; i <= frameCount; i++) {
        const image = new Image();
        image.src = currentFrame(i);
        preloadedImages.push(image);
    }
}

// Ensure the image behaves exactly like background-size: cover
function drawImageCover(ctx, img, canvasWidth, canvasHeight) {
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
    } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Scroll Event Handler for Canvas
window.addEventListener("scroll", () => {  
    const scrollTop = document.documentElement.scrollTop;
    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
    
    if(maxScrollTop <= 0) return;

    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );
    
    if(preloadedImages[frameIndex] && preloadedImages[frameIndex].complete) {
        requestAnimationFrame(() => {
            drawImageCover(context, preloadedImages[frameIndex], canvas.width, canvas.height);
        });
    } else {
        const tempImg = new Image();
        tempImg.src = currentFrame(frameIndex + 1);
        tempImg.onload = () => {
             requestAnimationFrame(() => {
                 drawImageCover(context, tempImg, canvas.width, canvas.height);
             });
        }
    }
});

// Kick off preloading
preloadAllImages();

// ------------------------------------------------------------------
// INTERSECTION OBSERVER FOR REVEAL ANIMATIONS
// ------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(
        entries,
        observer
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Un-comment to only animate once
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Trigger check immediately in case some elements are already in view
    setTimeout(() => {
        reveals.forEach(reveal => {
            const rect = reveal.getBoundingClientRect();
            if(rect.top < window.innerHeight - 50) {
                reveal.classList.add('active');
            }
        });
    }, 100);
});
