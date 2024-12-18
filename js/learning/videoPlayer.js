export function createVideoPlayer(videoUrl, title) {
    return `
        <div class="video-learning-container">
            <div class="video-player-container">
                <video id="microVideo" class="video-player" controls>
                    <source src="${videoUrl}" type="video/mp4">
                    您的浏览器不支持视频播放
                </video>
                <div class="video-info">
                    <h3>${title}</h3>
                    <div class="video-controls">
                        <button class="control-btn" id="prevVideo">
                            <i class="fas fa-step-backward"></i> 上一节
                        </button>
                        <button class="control-btn" id="nextVideo">
                            下一节 <i class="fas fa-step-forward"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div id="aiAssistantContainer"></div>
        </div>
    `;
}

export function initializeVideoControls(videoUrl, title) {
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = createVideoPlayer(videoUrl, title);
    
    // Initialize AI Assistant
    const aiAssistantContainer = document.getElementById('aiAssistantContainer');
    aiAssistantContainer.innerHTML = createAIAssistant();
    initializeAIAssistant();

    const video = document.getElementById('microVideo');
    if (!video) return;

    // Add video event listeners
    video.addEventListener('play', () => {
        console.log('Video started playing');
    });

    video.addEventListener('pause', () => {
        console.log('Video paused');
    });

    // Navigation controls
    document.getElementById('prevVideo')?.addEventListener('click', () => {
        console.log('Navigate to previous video');
    });

    document.getElementById('nextVideo')?.addEventListener('click', () => {
        console.log('Navigate to next video');
    });
}

// Import AI Assistant functions
import { createAIAssistant, initializeAIAssistant } from './aiAssistant.js';