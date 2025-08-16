# KHDA Inspection Frontend - HTML/CSS/JS Version

This is a vanilla HTML, CSS, and JavaScript version of the KHDA Inspection Frontend, converted from the original Next.js/React application.

## 🌟 Features

- **Exact Visual Replica**: Pixel-perfect recreation of the original design
- **Full Functionality**: Complete feature parity with the React version
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Modern Styling**: CSS variables, flexbox, and grid layouts
- **Interactive Elements**: File upload, form handling, API integration
- **Accessibility**: ARIA labels, semantic HTML, and keyboard navigation

## 📁 Project Structure

```
EAD-KHDA-Inspection-HTML/
├── index.html              # Homepage
├── inspector.html          # Inspector/Upload page
├── assets/
│   ├── css/
│   │   └── styles.css      # Main stylesheet (converted from Tailwind)
│   ├── js/
│   │   └── main.js         # JavaScript functionality
│   └── images/             # All logos and images
├── README.md               # This file
```

## 🎨 Styling

### CSS Architecture
- **CSS Variables**: For consistent theming and color management
- **Component-based**: Modular CSS classes for reusable components
- **Responsive Design**: Mobile-first breakpoints using media queries
- **Utility Classes**: Common layout and styling utilities

### Converted Components
- Header with sticky navigation
- Hero section with gradient backgrounds
- Feature cards with icons
- Partnership section with logos
- Footer with dynamic year
- File upload and analysis forms
- Alert/status messages
- Loading states and animations

## ⚡ JavaScript Functionality

### Core Features
- **File Upload**: Handle file selection and validation
- **API Integration**: Connect to the same backend as the React version
- **Form Handling**: Submit forms and manage state
- **UI Updates**: Dynamic content updates and loading states
- **Error Handling**: Display error messages and status alerts
- **Markdown Parsing**: Simple markdown-to-HTML conversion
- **Smooth Scrolling**: Navigation with smooth scroll behavior

### API Endpoints
- Analysis: `https://web-production-48e9c.up.railway.app/api/v1/analysis/analyze`
- Report Generation: `https://web-production-48e9c.up.railway.app/api/v1/inspection/generate-report`
- Downloads: `https://web-production-48e9c.up.railway.app/api/v1/reports/`

## 🚀 Getting Started

### Local Development
1. Clone or download this directory
2. Open `index.html` in a web browser
3. Or serve using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

### Deployment
- Upload all files to any web server
- No build process required
- Works on any hosting platform (GitHub Pages, Netlify, etc.)

## 🔧 Browser Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 60+, Safari 12+, Edge 79+
- **CSS Features**: CSS Grid, Flexbox, CSS Variables
- **JavaScript**: ES6+ features (arrow functions, async/await, fetch API)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (default)
- **Tablet**: 768px and up
- **Desktop**: 1024px and up

## 🎯 Key Differences from React Version

### Advantages
- **No Build Process**: Ready to deploy immediately
- **Faster Loading**: No JavaScript framework overhead
- **Better SEO**: Server-side rendered content
- **Universal Compatibility**: Works everywhere

### Considerations
- **Manual State Management**: No React state management
- **Basic Routing**: Simple page-to-page navigation
- **Limited Component Reuse**: HTML duplication instead of components

## 🔍 Code Highlights

### CSS Variables for Theming
```css
:root {
  --background: #ffffff;
  --foreground: #0f172a;
  --primary: #0f172a;
  --sky-600: #0284c7;
  --emerald-600: #059669;
  /* ... more variables */
}
```

### JavaScript Class Structure
```javascript
class KHDAInspectionApp {
  constructor() {
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.initializeInspectorPage();
  }
  
  // ... methods for functionality
}
```

### Responsive Grid Layouts
```css
.hero-container {
  display: grid;
  grid-template-columns: 1fr;
  /* Mobile first */
}

@media (min-width: 768px) {
  .hero-container {
    grid-template-columns: repeat(2, 1fr);
    /* Desktop layout */
  }
}
```

## 🛠 Customization

### Colors and Theming
Edit CSS variables in `assets/css/styles.css`:
```css
:root {
  --primary: #your-color;
  --sky-600: #your-blue;
  /* Update any color */
}
```

### Layout and Spacing
Modify utility classes or component styles in the CSS file.

### Functionality
Update JavaScript in `assets/js/main.js` to modify behavior.

## 📄 License

This project maintains the same license as the original React version.

## 🤝 Contributing

1. Make changes to HTML, CSS, or JavaScript files
2. Test in multiple browsers
3. Ensure responsive design works
4. Submit pull requests

## 🐛 Known Issues

- IE11 and older browsers not supported
- Some advanced CSS features may need polyfills for older browsers

## 📞 Support

For issues or questions, refer to the original project documentation or contact the development team at Techno Group Originator.

---

**Built by Techno Group Originator under the EAD project**  
**KHDA Framework AI Inspection Services** 