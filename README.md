# WeatherVue

## Introduction

WeatherVue is a web application that integrates with the public API provided by the Central Weather Bureau of the Republic of China (Taiwan). Utilizing the data offered by this API, the application employs advanced visualization techniques to enhance the accessibility of complex weather data for users. The project leverages Vue, Bootstrap, and Leaflet technologies, facilitating the rapid and practical development of the web interface.

## Features

- **Real-time Weather Data**: Access current information from weather observation stations across Taiwan including temperature, wind speed, and forecasts
- **Station Positioning**: Precise location data for all observation stations
- **Interactive Map**: Explore weather observation stations throughout Taiwan with an interactive map interface
- **Station Details**: Click on map markers to view detailed information about each observation station
- **Search Functionality**: Find observation stations by name or location
- **Radar Echo Map**: Visualize precipitation patterns across regions

## Technologies Used

- **Vue.js 3**: Frontend framework with Composition API
- **Vue Router**: For application routing
- **Bootstrap 5**: UI component library and responsive design
- **Leaflet**: Interactive mapping library
- **Axios**: HTTP client for API requests

## Mobile Design Enhancements (Brief)

- Glassmorphism visuals with layered gradients and shadow hierarchy; interactive feedback (press scale, focus glow)
- Upgrades across mobile views: search page, weather cards, forecast, radar, navbar, info, plus global background/animations
- Performance: GPU-accelerated transforms, optimized gradients/transitions, smooth page animations
- Compatibility: iOS Safari 12+, Chrome/Edge 80+, Firefox 75+, Samsung Internet 12+

## Responsive Design Updates (Brief)

- Breakpoints at 1200/992/768/576/420px for desktop/tablet/mobile tuning
- Layout: grids collapse to single column, vertical stacking, buttons wrap/reflow on small screens
- Page optimizations: navbar, search, weather cards, forecast and cards, radar, map, info
- Touch-friendly: minimum 44px targets, smooth scrolling, visible tap highlight
- Performance: adaptive background/media sizing, scaled map/markers on small devices

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/jemmy9211/WeatherVue.git
   cd WeatherVue
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up API Key**
   - Create a `.env` file in the root directory
   - Copy the contents from `.env.example`:
     ```bash
     cp .env.example .env
     ```
   - Get your API key from [CWA Open Data Platform](https://opendata.cwa.gov.tw/)
   - Update the `.env` file with your API key:
     ```
     VITE_CWA_KEY=your_actual_api_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

### Important Notes
- **API Key Required**: The app requires a valid API key from Taiwan's Central Weather Administration
- **Environment Variables**: Make sure to restart the dev server after modifying the `.env` file
- **CORS**: The CWA API should work with proper authentication; if you encounter CORS issues, verify your API key is correct

Project GitHub Page Link: [WeatherVue GitHub Page](https://jemmy9211.github.io/WeatherVue/)

Please note that the Central Weather Bureau recently upgraded to the Meteorological Agency (CWA - Central Weather Administration). Last updated on 2023/10/11 by Jemmy at Selab.

## Reference

- Deploying a Vue project to GitHub Pages: [Link](https://dev.to/yubo0826/vuevite-bu-shu-dao-github-pagesjian-yi-jiao-xue-1l9n)
- Methods for passing parameters with Vue Router: [Link](https://juejin.cn/post/6999913464361648159)
- Guide to meteorological bureau abbreviations: [Link](https://opendata.cwb.gov.tw/opendatadoc/MFC/D0047.pdf)
- testing