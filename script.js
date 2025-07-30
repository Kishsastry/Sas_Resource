// High School Organizer - JavaScript Functionality

// Global Variables
let classes = JSON.parse(localStorage.getItem('classes')) || [];
let homework = JSON.parse(localStorage.getItem('homework')) || [];
let rewardPoints = parseInt(localStorage.getItem('rewardPoints')) || 0;
let currentMood = parseInt(localStorage.getItem('currentMood')) || 3;

// Memory Game Variables
let memoryCards = [];
let flippedCards = [];
let memoryMoves = 0;
let memoryStartTime = null;
let memoryTimer = null;

// Math Game Variables
let mathScore = 0;
let mathTimer = 30;
let mathInterval = null;
let currentMathAnswer = 0;

// Focus Timer Variables
let focusTimer = null;
let focusTime = 25 * 60; // 25 minutes in seconds
let breakTime = 5 * 60; // 5 minutes in seconds
let currentTime = focusTime;
let isBreak = false;
let isRunning = false;

// Motivational Quotes
const quotes = [
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" }
];

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateDashboard();
    displayClasses();
    displayHomework();
    updateMoodDisplay();
    displayRandomQuote();
    setupNavigation();
});

// Initialize Application
function initializeApp() {
    // Set reward points display
    document.getElementById('reward-points').textContent = rewardPoints;
    
    // Set initial timer display
    updateTimerDisplay();
}

// Navigation System
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// Dashboard Functions
function updateDashboard() {
    updateTasksToday();
    updateCompletedWeek();
    updateOverallProgress();
}

function updateTasksToday() {
    const today = new Date().toISOString().split('T')[0];
    const tasksToday = homework.filter(hw => hw.dueDate === today && !hw.completed).length;
    document.getElementById('tasks-today').textContent = tasksToday;
}

function updateCompletedWeek() {
    const completedThisWeek = homework.filter(hw => hw.completed).length;
    document.getElementById('completed-week').textContent = completedThisWeek;
}

function updateOverallProgress() {
    const totalTasks = homework.length;
    const completedTasks = homework.filter(hw => hw.completed).length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const progressBar = document.getElementById('overall-progress');
    progressBar.style.width = progress + '%';
}

// Classes Management
function addClass() {
    const name = document.getElementById('class-name').value;
    const teacher = document.getElementById('class-teacher').value;
    const time = document.getElementById('class-time').value;
    const day = document.getElementById('class-day').value;
    
    if (!name || !teacher || !time || !day) {
        alert('Please fill in all fields');
        return;
    }
    
    const newClass = {
        id: Date.now(),
        name,
        teacher,
        time,
        day
    };
    
    classes.push(newClass);
    localStorage.setItem('classes', JSON.stringify(classes));
    
    // Clear form
    document.getElementById('class-name').value = '';
    document.getElementById('class-teacher').value = '';
    document.getElementById('class-time').value = '';
    
    displayClasses();
    addRewardPoints(5);
}

function displayClasses() {
    const scheduleGrid = document.getElementById('schedule-grid');
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    
    scheduleGrid.innerHTML = '';
    
    days.forEach(day => {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'day-column';
        
        const dayHeader = document.createElement('div');
        dayHeader.className = 'day-header';
        dayHeader.textContent = day.charAt(0).toUpperCase() + day.slice(1);
        dayColumn.appendChild(dayHeader);
        
        const dayClasses = classes.filter(cls => cls.day === day);
        dayClasses.sort((a, b) => a.time.localeCompare(b.time));
        
        dayClasses.forEach(cls => {
            const classItem = document.createElement('div');
            classItem.className = 'class-item';
            classItem.innerHTML = `
                <div class="class-name">${cls.name}</div>
                <div class="class-teacher">${cls.teacher}</div>
                <div class="class-time">${cls.time}</div>
                <button onclick="removeClass(${cls.id})" class="btn btn-small" style="background: var(--warm-orange); margin-top: 0.5rem;">Remove</button>
            `;
            dayColumn.appendChild(classItem);
        });
        
        scheduleGrid.appendChild(dayColumn);
    });
}

function removeClass(id) {
    classes = classes.filter(cls => cls.id !== id);
    localStorage.setItem('classes', JSON.stringify(classes));
    displayClasses();
}

// Homework Management
function addHomework() {
    const title = document.getElementById('hw-title').value;
    const subject = document.getElementById('hw-subject').value;
    const dueDate = document.getElementById('hw-due-date').value;
    const priority = document.getElementById('hw-priority').value;
    const notes = document.getElementById('hw-notes').value;
    
    if (!title || !subject || !dueDate) {
        alert('Please fill in required fields');
        return;
    }
    
    const newHomework = {
        id: Date.now(),
        title,
        subject,
        dueDate,
        priority,
        notes,
        completed: false,
        dateAdded: new Date().toISOString()
    };
    
    homework.push(newHomework);
    localStorage.setItem('homework', JSON.stringify(homework));
    
    // Clear form
    document.getElementById('hw-title').value = '';
    document.getElementById('hw-subject').value = '';
    document.getElementById('hw-due-date').value = '';
    document.getElementById('hw-notes').value = '';
    
    displayHomework();
    updateDashboard();
    addRewardPoints(3);
}

function displayHomework() {
    const homeworkList = document.getElementById('homework-list');
    homeworkList.innerHTML = '';
    
    // Sort homework by due date and priority
    const sortedHomework = homework.sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed - b.completed;
        }
        if (a.dueDate !== b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    
    sortedHomework.forEach(hw => {
        const hwItem = document.createElement('div');
        hwItem.className = `homework-item ${hw.priority} ${hw.completed ? 'completed' : ''}`;
        
        const dueDate = new Date(hw.dueDate);
        const today = new Date();
        const timeDiff = dueDate - today;
        const daysUntilDue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        
        let dueDateText = '';
        if (daysUntilDue < 0) {
            dueDateText = `Overdue by ${Math.abs(daysUntilDue)} days`;
        } else if (daysUntilDue === 0) {
            dueDateText = 'Due today';
        } else if (daysUntilDue === 1) {
            dueDateText = 'Due tomorrow';
        } else {
            dueDateText = `Due in ${daysUntilDue} days`;
        }
        
        hwItem.innerHTML = `
            <div class="homework-header">
                <div class="homework-title">${hw.title}</div>
                <div class="homework-priority ${hw.priority}">${hw.priority.toUpperCase()}</div>
            </div>
            <div class="homework-meta">
                <span><strong>Subject:</strong> ${hw.subject}</span>
                <span><strong>Due:</strong> ${dueDateText}</span>
            </div>
            ${hw.notes ? `<div class="homework-notes"><strong>Notes:</strong> ${hw.notes}</div>` : ''}
            <div class="homework-actions">
                ${!hw.completed ? 
                    `<button onclick="completeHomework(${hw.id})" class="btn btn-small" style="background: var(--accent-green);">Complete</button>` :
                    `<button onclick="uncompleteHomework(${hw.id})" class="btn btn-small" style="background: var(--medium-gray);">Undo</button>`
                }
                <button onclick="removeHomework(${hw.id})" class="btn btn-small" style="background: var(--warm-orange);">Remove</button>
            </div>
        `;
        
        homeworkList.appendChild(hwItem);
    });
}

function completeHomework(id) {
    const hw = homework.find(hw => hw.id === id);
    if (hw) {
        hw.completed = true;
        localStorage.setItem('homework', JSON.stringify(homework));
        displayHomework();
        updateDashboard();
        addRewardPoints(10);
    }
}

function uncompleteHomework(id) {
    const hw = homework.find(hw => hw.id === id);
    if (hw) {
        hw.completed = false;
        localStorage.setItem('homework', JSON.stringify(homework));
        displayHomework();
        updateDashboard();
        removeRewardPoints(10);
    }
}

function removeHomework(id) {
    homework = homework.filter(hw => hw.id !== id);
    localStorage.setItem('homework', JSON.stringify(homework));
    displayHomework();
    updateDashboard();
}

// Stress Management
function setMood(mood) {
    currentMood = mood;
    localStorage.setItem('currentMood', mood);
    updateMoodDisplay();
    
    const moodFeedback = document.getElementById('mood-feedback');
    const feedbacks = [
        "It's okay to have tough days. Consider talking to someone or trying our breathing exercise.",
        "Things might be challenging right now. Take a break and be kind to yourself.",
        "You're doing okay. Remember that every day is a new opportunity.",
        "Great to see you're feeling positive! Keep up the good work.",
        "Awesome! You're feeling fantastic. Channel this energy into your studies!"
    ];
    
    moodFeedback.textContent = feedbacks[mood - 1];
    moodFeedback.style.color = mood <= 2 ? 'var(--warm-orange)' : mood === 3 ? 'var(--medium-gray)' : 'var(--accent-green)';
}

function updateMoodDisplay() {
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach((btn, index) => {
        if (index + 1 === currentMood) {
            btn.style.background = 'rgba(37, 99, 235, 0.2)';
            btn.style.transform = 'scale(1.2)';
        } else {
            btn.style.background = 'none';
            btn.style.transform = 'scale(1)';
        }
    });
}

// Breathing Exercise
function startBreathingExercise() {
    const circle = document.getElementById('breathing-circle');
    const instruction = document.getElementById('breathing-instruction');
    const btn = document.getElementById('breathing-btn');
    
    btn.disabled = true;
    btn.textContent = 'Breathing...';
    
    let cycle = 0;
    const totalCycles = 4;
    
    function breathingCycle() {
        if (cycle >= totalCycles) {
            instruction.textContent = 'Great job! You completed the breathing exercise.';
            btn.disabled = false;
            btn.textContent = 'Start 4-7-8 Breathing';
            circle.classList.remove('inhale', 'exhale');
            addRewardPoints(5);
            return;
        }
        
        // Inhale for 4 seconds
        instruction.textContent = 'Breathe in through your nose... (4 seconds)';
        circle.classList.add('inhale');
        circle.classList.remove('exhale');
        
        setTimeout(() => {
            // Hold for 7 seconds
            instruction.textContent = 'Hold your breath... (7 seconds)';
            
            setTimeout(() => {
                // Exhale for 8 seconds
                instruction.textContent = 'Exhale through your mouth... (8 seconds)';
                circle.classList.add('exhale');
                circle.classList.remove('inhale');
                
                setTimeout(() => {
                    cycle++;
                    breathingCycle();
                }, 8000);
            }, 7000);
        }, 4000);
    }
    
    breathingCycle();
}

// Motivational Quotes
function displayRandomQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-text').textContent = `"${randomQuote.text}"`;
    document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;
}

function getNewQuote() {
    displayRandomQuote();
    addRewardPoints(1);
}

// Reward System
function addRewardPoints(points) {
    rewardPoints += points;
    localStorage.setItem('rewardPoints', rewardPoints);
    document.getElementById('reward-points').textContent = rewardPoints;
    
    // Show points gained animation (could be enhanced with CSS)
    const pointsElement = document.getElementById('reward-points');
    pointsElement.style.transform = 'scale(1.2)';
    pointsElement.style.color = 'var(--accent-green)';
    
    setTimeout(() => {
        pointsElement.style.transform = 'scale(1)';
        pointsElement.style.color = 'inherit';
    }, 500);
}

function removeRewardPoints(points) {
    rewardPoints = Math.max(0, rewardPoints - points);
    localStorage.setItem('rewardPoints', rewardPoints);
    document.getElementById('reward-points').textContent = rewardPoints;
}

// Memory Game
function startMemoryGame() {
    if (rewardPoints < 10) {
        alert('You need at least 10 points to play Memory Match!');
        return;
    }
    
    removeRewardPoints(10);
    
    const gameDiv = document.getElementById('memory-game');
    gameDiv.classList.remove('hidden');
    
    // Create cards
    const symbols = ['🌟', '🎵', '🎨', '📚', '🏆', '🎯', '🌈', '⚡'];
    memoryCards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    
    const gridDiv = document.getElementById('memory-grid');
    gridDiv.innerHTML = '';
    memoryMoves = 0;
    flippedCards = [];
    memoryStartTime = Date.now();
    
    document.getElementById('memory-moves').textContent = '0';
    document.getElementById('memory-time').textContent = '0';
    
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        gridDiv.appendChild(card);
    });
    
    // Start timer
    memoryTimer = setInterval(updateMemoryTimer, 1000);
}

function flipCard(e) {
    const card = e.target;
    
    if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length >= 2) {
        return;
    }
    
    card.classList.add('flipped');
    card.textContent = card.dataset.symbol;
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        memoryMoves++;
        document.getElementById('memory-moves').textContent = memoryMoves;
        
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.symbol === card2.dataset.symbol) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        // Check if game is complete
        const matchedCards = document.querySelectorAll('.memory-card.matched');
        if (matchedCards.length === memoryCards.length) {
            clearInterval(memoryTimer);
            setTimeout(() => {
                alert(`Congratulations! You completed the game in ${memoryMoves} moves!`);
                addRewardPoints(25);
            }, 500);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        card1.textContent = '';
        card2.textContent = '';
    }
    
    flippedCards = [];
}

function updateMemoryTimer() {
    const elapsed = Math.floor((Date.now() - memoryStartTime) / 1000);
    document.getElementById('memory-time').textContent = elapsed;
}

// Math Game
function startMathGame() {
    if (rewardPoints < 5) {
        alert('You need at least 5 points to play Quick Math!');
        return;
    }
    
    removeRewardPoints(5);
    
    const gameDiv = document.getElementById('math-game');
    gameDiv.classList.remove('hidden');
    
    mathScore = 0;
    mathTimer = 30;
    
    document.getElementById('math-score').textContent = '0';
    document.getElementById('math-timer').textContent = '30';
    
    generateMathQuestion();
    
    mathInterval = setInterval(() => {
        mathTimer--;
        document.getElementById('math-timer').textContent = mathTimer;
        
        if (mathTimer <= 0) {
            endMathGame();
        }
    }, 1000);
    
    // Handle answer input
    const answerInput = document.getElementById('math-answer');
    answerInput.focus();
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkMathAnswer();
        }
    });
}

function generateMathQuestion() {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2;
    
    switch (operation) {
        case '+':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            currentMathAnswer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 50) + 25;
            num2 = Math.floor(Math.random() * 25) + 1;
            currentMathAnswer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 12) + 1;
            num2 = Math.floor(Math.random() * 12) + 1;
            currentMathAnswer = num1 * num2;
            break;
    }
    
    document.getElementById('math-question').textContent = `${num1} ${operation} ${num2} = ?`;
}

function checkMathAnswer() {
    const userAnswer = parseInt(document.getElementById('math-answer').value);
    
    if (userAnswer === currentMathAnswer) {
        mathScore++;
        document.getElementById('math-score').textContent = mathScore;
        document.getElementById('math-answer').style.background = '#10b981';
        
        setTimeout(() => {
            document.getElementById('math-answer').style.background = '';
            document.getElementById('math-answer').value = '';
            generateMathQuestion();
        }, 500);
    } else {
        document.getElementById('math-answer').style.background = '#ef4444';
        setTimeout(() => {
            document.getElementById('math-answer').style.background = '';
        }, 500);
    }
}

function endMathGame() {
    clearInterval(mathInterval);
    const pointsEarned = mathScore * 2;
    addRewardPoints(pointsEarned);
    alert(`Time's up! You scored ${mathScore} points and earned ${pointsEarned} reward points!`);
    
    document.getElementById('math-answer').removeEventListener('keypress', checkMathAnswer);
}

// Focus Timer (Pomodoro)
function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    document.getElementById('timer-start').disabled = true;
    
    focusTimer = setInterval(() => {
        currentTime--;
        updateTimerDisplay();
        
        if (currentTime <= 0) {
            completeTimerSession();
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    
    isRunning = false;
    document.getElementById('timer-start').disabled = false;
    clearInterval(focusTimer);
}

function resetTimer() {
    isRunning = false;
    document.getElementById('timer-start').disabled = false;
    clearInterval(focusTimer);
    
    currentTime = isBreak ? breakTime : focusTime;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function completeTimerSession() {
    clearInterval(focusTimer);
    isRunning = false;
    document.getElementById('timer-start').disabled = false;
    
    if (isBreak) {
        // Break completed, switch to focus
        alert('Break time is over! Ready to focus again?');
        isBreak = false;
        currentTime = focusTime;
        document.getElementById('timer-type').textContent = 'Focus Time';
        addRewardPoints(5);
    } else {
        // Focus session completed, switch to break
        alert('Great job! Time for a break!');
        isBreak = true;
        currentTime = breakTime;
        document.getElementById('timer-type').textContent = 'Break Time';
        addRewardPoints(15);
    }
    
    updateTimerDisplay();
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                showSection('dashboard');
                break;
            case '2':
                e.preventDefault();
                showSection('classes');
                break;
            case '3':
                e.preventDefault();
                showSection('homework');
                break;
            case '4':
                e.preventDefault();
                showSection('stress');
                break;
            case '5':
                e.preventDefault();
                showSection('resources');
                break;
            case '6':
                e.preventDefault();
                showSection('games');
                break;
        }
    }
});

// Auto-save functionality
setInterval(() => {
    localStorage.setItem('classes', JSON.stringify(classes));
    localStorage.setItem('homework', JSON.stringify(homework));
    localStorage.setItem('rewardPoints', rewardPoints);
    localStorage.setItem('currentMood', currentMood);
}, 30000); // Auto-save every 30 seconds
