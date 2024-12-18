document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal container
    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container';
    document.body.appendChild(modalContainer);

    // Theory Learning Section
    const theorySection = document.querySelector('.theory-section');
    theorySection?.addEventListener('click', async () => {
        const { createTheoryLearningModal } = await import('./learning/theoryLearning.js');
        showModal(createTheoryLearningModal());
        initializeTheoryListeners();
    });

    // Skills Training Section
    const skillsSection = document.querySelector('.skills-section');
    skillsSection?.addEventListener('click', async () => {
        const { createSkillsTrainingModal } = await import('./learning/skillsTraining.js');
        showModal(createSkillsTrainingModal());
        initializeSkillsListeners();
    });

    // Tool buttons functionality
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const toolType = this.textContent.trim();
            console.log(`Opening ${toolType}`);
        });
    });
});

// Show modal function
function showModal(modalContent) {
    const modalContainer = document.querySelector('.modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = modalContent;
    modalContainer.style.display = 'flex';

    // Close button functionality
    const closeBtn = modalContainer.querySelector('.close-modal');
    closeBtn?.addEventListener('click', () => {
        modalContainer.style.display = 'none';
        modalContainer.innerHTML = '';
    });

    // Close on outside click
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer.style.display = 'none';
            modalContainer.innerHTML = '';
        }
    });
}

// Initialize theory learning listeners
async function initializeTheoryListeners() {
    const modal = document.querySelector('.theory-modal');
    if (!modal) return;

    const { createSystematicContent, createMicroContent, createCaseContent } = 
        await import('./learning/theoryLearning.js');

    const options = modal.querySelectorAll('.learning-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const type = option.getAttribute('data-type');
            let content;
            switch (type) {
                case 'systematic':
                    content = createSystematicContent();
                    break;
                case 'micro':
                    content = createMicroContent();
                    break;
                case 'case':
                    content = createCaseContent();
                    break;
            }
            modal.querySelector('.modal-body').innerHTML = content;
            initializeBackButtons();
            initializeVideoPlayers();
        });
    });
}

// Initialize skills training listeners
function initializeSkillsListeners() {
    const modal = document.querySelector('.skills-modal');
    if (!modal) return;

    const startButtons = modal.querySelectorAll('.start-btn');
    startButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const trainingType = this.closest('.training-item').querySelector('h4').textContent;
            console.log(`Starting training: ${trainingType}`);
        });
    });
}

// Initialize back buttons
async function initializeBackButtons() {
    const backBtns = document.querySelectorAll('.back-btn');
    backBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const modalBody = this.closest('.modal-body');
            const modalType = this.closest('.learning-modal').classList[1];
            
            switch (modalType) {
                case 'theory-modal':
                    const { createTheoryLearningModal } = await import('./learning/theoryLearning.js');
                    modalBody.innerHTML = createTheoryLearningModal()
                        .match(/<div class="modal-body">([\s\S]*?)<\/div>/)[1];
                    initializeTheoryListeners();
                    break;
            }
        });
    });
}

// Initialize video players
async function initializeVideoPlayers() {
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        item.addEventListener('click', async () => {
            const title = item.querySelector('span').textContent;
            const { createVideoPlayer, initializeVideoControls } = await import('./learning/videoPlayer.js');
            const modalBody = item.closest('.modal-body');
            modalBody.innerHTML = createVideoPlayer('https://example.com/sample-video.mp4', title);
            initializeVideoControls('https://example.com/sample-video.mp4', title);
        });
    });
}