# Salvador Indigent Memorial Services (SIMS) Website

A modern, responsive website for Salvador Indigent Memorial Services, providing compassionate memorial care in Valencia City and Cagayan De Oro, Philippines.

## 🌐 Live Website
**URL:** https://salvadorindigentmemorialservice.github.io/SIMS/

## 📋 Overview

This website serves as the digital presence for Salvador Indigent Memorial Services, a family-owned memorial service provider with over 21 years of experience. The site features comprehensive information about memorial plans, services, and includes an interactive online application system.

## ✨ Features

### Core Pages
- **Home Page** - Hero section with call-to-action buttons and company highlights
- **About Us** - Company mission, vision, and location information with embedded maps
- **Services** - Detailed memorial plans (Orchids, Sunflower, Anthurium, Sampaguita) with pricing
- **Contact** - Multiple contact methods and branch locations
- **Apply Online** - Multi-step application process with digital signature capture

### Key Functionality
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Digital Signature Capture** - Canvas-based signature pad for online applications
- **Interactive Maps** - Embedded Google Maps for both Valencia and Cagayan De Oro branches
- **Accessibility Features** - ARIA labels, semantic HTML, and keyboard navigation support
- **Modern UI/UX** - Clean design with hover effects and smooth transitions

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Custom properties and modern layout techniques
- **JavaScript (ES6+)** - Modern JavaScript with error handling
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Google Fonts** - Lato font family for typography

### Libraries & Dependencies
- **Signature Pad** - Canvas-based signature capture
- **Google Maps Embed API** - Interactive location maps
- **Google Forms** - Application form processing

### Design System
- **Color Palette:**
  - Primary Blue: `#007BFF`
  - Primary Green: `#28A745`
  - Primary Red: `#DC3545`
  - Light Grey: `#F8F9FA`
  - Dark Grey: `#343A40`

## 📁 Project Structure

```
SIMS/
├── index.html              # Home page
├── about.html              # About us page
├── services.html           # Memorial services and plans
├── contact.html            # Contact information and maps
├── apply.html              # Online application form
├── styles.css              # Main stylesheet
├── script.js               # Application form JavaScript
├── README.md               # Project documentation
├── TODO.md                 # Development progress tracker
├── logo.jpg                # Company logo
├── casket1.png             # Orchids plan image
├── casket2.png             # Sunflower plan image
├── casket3.png             # Anthurium plan image
└── casket4.png             # Sampaguita plan image
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for CDN resources and Google services)

### Local Development
1. Clone or download the repository
2. Open `index.html` in a web browser
3. For local server (recommended):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```
4. Navigate to `http://localhost:8000`

### Deployment
The website is designed for static hosting and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static web hosting service

## 🎨 Design Features

### Responsive Breakpoints
- **Mobile:** < 576px
- **Tablet:** 576px - 768px
- **Desktop:** 768px - 992px
- **Large Desktop:** > 992px

### Accessibility
- ARIA labels and roles
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast color ratios

### Performance Optimizations
- Optimized images with proper alt text
- Efficient CSS with minimal redundancy
- Graceful fallbacks for external resources
- Error handling for all interactive features

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari, Chrome Mobile)

## 🔧 Configuration

### Google Form Integration
Update the Google Form URL in `script.js`:
```javascript
const config = {
  googleFormUrl: 'https://forms.gle/YOUR_FORM_ID',
  // ... other config
};
```

### Contact Information
Update contact details in `contact.html` and other relevant pages as needed.

### Map Locations
Google Maps embed codes can be updated in `about.html` and `contact.html` for accurate location display.

## 📈 SEO Features

- Semantic HTML structure
- Meta descriptions and keywords
- Open Graph tags ready
- Structured data markup ready
- Fast loading times
- Mobile-friendly design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers
5. Submit a pull request

## 📞 Support

For technical support or questions about the website:
- **Email:** salvadorindigentmemorialserv@gmail.com
- **Phone:** 0926 792 1987 | 0906 368 6674 | 0905 076 2726

## 📄 License

This project is proprietary to Salvador Indigent Memorial Services. All rights reserved.

## 🏆 Credits

**Development Team:** SIMS Development Team  
**Last Updated:** 2025  
**Company:** Salvador Indigent Memorial Services  
**Established:** 2003  

---

*"Because we love you, we care for you"* - Salvador Indigent Memorial Services
