# High School Organizer - Developer Playbook

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Key Features](#key-features)
5. [Development Guidelines](#development-guidelines)
6. [Customization Guide](#customization-guide)
7. [Adding New Features](#adding-new-features)
8. [Troubleshooting](#troubleshooting)
9. [Deployment](#deployment)

## 🎯 Project Overview

**Project Name:** Adya's High School Organizer  
**Technology Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+)  
**Target Users:** High school students taking AP courses  
**Purpose:** Complete academic organization tool with wellness features and gamification

### Core Objectives
- Homework and assignment tracking
- Class schedule management
- Stress management and wellness tools
- Educational resource aggregation
- Gamified reward system
- Study tools and games

## 🏗️ Architecture

### Frontend Architecture
- **Single Page Application (SPA)** with section-based navigation
- **Local Storage** for data persistence
- **CSS Grid & Flexbox** for responsive layouts
- **CSS Custom Properties** for theming
- **Event-driven JavaScript** for interactivity

### Data Flow
```
User Action → JavaScript Function → Local Storage → UI Update
```

### State Management
All application state is managed through:
- `localStorage` for persistence
- Global JavaScript variables for session state
- No external state management libraries

## 📁 File Structure

```
highschool_organizer/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # All JavaScript functionality
└── playbook.md         # This developer guide
```

### File Responsibilities

#### `index.html`
- Semantic HTML5 structure
- Six main sections: Dashboard, Classes, Homework, Wellness, Resources, Games
- Font Awesome icons integration
- Accessibility-focused markup

#### `styles.css`
- CSS Custom Properties for theming
- Mobile-first responsive design
- CSS Grid layouts for complex components
- Hover effects and animations
- Print-friendly styles

#### `script.js`
- Complete application logic
- Local storage management
- Game implementations
- Timer functionality
- Navigation system

## ⭐ Key Features

### 1. Dashboard
- **Tasks due today counter**
- **Weekly completion stats**
- **Overall progress visualization**
- **Reward points display**
- **Quick action buttons**

### 2. Class Schedule
- **Add/remove classes**
- **Weekly grid view**
- **Time-based sorting**
- **Teacher information**

### 3. Homework Tracker
- **Priority-based organization**
- **Due date calculations**
- **Completion tracking**
- **Notes and subject categorization**

### 4. Wellness Center
- **Mood tracking with emoji interface**
- **4-7-8 breathing exercise with visual guide**
- **Motivational quote rotation**
- **Stress management tools**

### 5. Study Resources
- **AP-specific YouTube channels**
- **Curated study guides**
- **Subject-based organization**
- **Direct links to educational content**

### 6. Reward Games
- **Memory Match game**
- **Quick Math challenges**
- **Pomodoro focus timer**
- **Point-based reward system**

## 🛠️ Development Guidelines

### Code Style
- **Camel Case** for JavaScript variables and functions
- **Kebab Case** for CSS classes
- **Semantic HTML** elements
- **Mobile-first** CSS approach
- **Progressive enhancement**

### JavaScript Patterns
```javascript
// Global state management
let globalVariable = JSON.parse(localStorage.getItem('key')) || defaultValue;

// Function naming convention
function verbNoun() { /* action-oriented names */ }

// Event handling
element.addEventListener('event', function(e) {
    e.preventDefault();
    // Handle event
});

// Local storage operations
localStorage.setItem('key', JSON.stringify(data));
const data = JSON.parse(localStorage.getItem('key')) || fallback;
```

### CSS Best Practices
```css
/* Use CSS custom properties */
:root {
    --primary-color: #2563eb;
    --spacing-unit: 1rem;
}

/* Mobile-first media queries */
@media (min-width: 768px) {
    /* Tablet and desktop styles */
}

/* BEM-like naming for complex components */
.component__element--modifier { }
```

## 🎨 Customization Guide

### Theming
All colors are defined in CSS custom properties in `:root`:
```css
:root {
    --primary-blue: #2563eb;
    --secondary-purple: #7c3aed;
    --accent-green: #059669;
    --warm-orange: #ea580c;
    /* ... more colors */
}
```

### Adding New Subjects
1. **Add to Resources Section** in `index.html`:
```html
<div class="resource-category">
    <h3>📐 New Subject</h3>
    <div class="resource-links">
        <!-- Add resource links -->
    </div>
</div>
```

2. **Add Study Guide Sub-section** (optional):
```html
<h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem; color: var(--secondary-purple); font-size: 1.1rem;">📖 Study Guides</h4>
<div class="resource-links">
    <!-- Add study guide links -->
</div>
```

### Modifying Reward System
Adjust point values in `script.js`:
```javascript
// Current point values
addHomework() -> +3 points
completeHomework() -> +10 points
addClass() -> +5 points
completeFocusSession() -> +15 points
completeBreathingExercise() -> +5 points
```

## 🚀 Adding New Features

### Step-by-Step Process

1. **Plan the Feature**
   - Define user requirements
   - Identify UI components needed
   - Plan data structure
   - Consider mobile responsiveness

2. **Update HTML Structure**
   ```html
   <section id="new-feature" class="section">
       <h1>Feature Title</h1>
       <!-- Feature content -->
   </section>
   ```

3. **Add Navigation**
   ```html
   <li><a href="#new-feature" class="nav-link">Feature</a></li>
   ```

4. **Implement Styling**
   ```css
   .new-feature-class {
       /* Styles following existing patterns */
   }
   ```

5. **Add JavaScript Functionality**
   ```javascript
   // Global variables
   let newFeatureData = JSON.parse(localStorage.getItem('newFeature')) || [];
   
   // Main functions
   function addNewFeatureItem() { }
   function displayNewFeature() { }
   function removeNewFeatureItem() { }
   ```

6. **Test Thoroughly**
   - Desktop and mobile responsiveness
   - Local storage persistence
   - Cross-browser compatibility
   - Accessibility features

### Common Patterns

#### Adding a New Game
1. Add HTML structure in games section
2. Implement game logic in `script.js`
3. Add point cost/reward system
4. Include win/lose conditions
5. Add reset functionality

#### Adding Data Management Feature
1. Define data structure
2. Implement CRUD operations
3. Add local storage persistence
4. Create display functions
5. Add form validation

## 🐛 Troubleshooting

### Common Issues

#### Local Storage Problems
```javascript
// Clear all data
localStorage.clear();

// Check data integrity
console.log(JSON.parse(localStorage.getItem('homework')));

// Reset specific data
localStorage.removeItem('classes');
```

#### CSS Layout Issues
- Check CSS Grid browser support
- Verify CSS custom property fallbacks
- Test responsive breakpoints
- Validate HTML structure

#### JavaScript Errors
- Check browser console for errors
- Verify event listener attachments
- Test function parameter types
- Validate JSON parsing operations

### Performance Optimization
- Minimize DOM queries (cache elements)
- Use event delegation for dynamic content
- Optimize CSS selectors
- Compress images and assets

## 📱 Deployment

### Static Hosting Options
- **GitHub Pages** (free, version controlled)
- **Netlify** (free tier, continuous deployment)
- **Vercel** (free tier, automatic builds)
- **Firebase Hosting** (Google integration)

### Deployment Steps
1. Ensure all files are in root directory
2. Test locally in different browsers
3. Validate HTML/CSS
4. Optimize images and assets
5. Deploy to hosting platform
6. Test deployed version

### Environment Considerations
- **HTTPS required** for some modern web APIs
- **Mobile testing** on actual devices
- **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)
- **Performance testing** with slow connections

## 📚 Resources for Future Development

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/) - Web standards reference
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [JavaScript ES6+ Features](https://github.com/lukehoban/es6features)

### Tools
- **VS Code** with extensions: Live Server, Prettier, ESLint
- **Chrome DevTools** for debugging
- **Lighthouse** for performance auditing
- **Wave** for accessibility testing

### Testing Checklist
- [ ] All features work on mobile devices
- [ ] Data persists after browser refresh
- [ ] All links open correctly
- [ ] Forms validate input properly
- [ ] Games function without errors
- [ ] Timer operates accurately
- [ ] Responsive design works at all breakpoints
- [ ] Accessibility features are functional

## 🤝 Contributing Guidelines

### Before Making Changes
1. Test current functionality thoroughly
2. Document any bugs found
3. Plan changes with minimal disruption
4. Consider backward compatibility

### Code Review Checklist
- [ ] Code follows established patterns
- [ ] Mobile responsiveness maintained
- [ ] Local storage usage is appropriate
- [ ] Error handling is implemented
- [ ] Performance impact is minimal
- [ ] Accessibility is preserved

### Version Control Best Practices
- Use descriptive commit messages
- Test changes before committing
- Keep commits focused on single features
- Document breaking changes

---

**Last Updated:** July 30, 2025  
**Version:** 1.0  
**Maintainer:** Development Team  

For questions or support, refer to this playbook first, then consult the project repository issues or documentation.
