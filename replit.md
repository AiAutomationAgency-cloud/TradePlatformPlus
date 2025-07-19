# StockSense AI - Browser Extension Replit.md

## Overview

StockSense AI is a browser extension that provides intelligent trading assistance for stock market platforms (Zerodha, Groww, AngelOne). The extension combines data extraction, pattern recognition, and AI analysis to help users make informed trading decisions. It features a hybrid architecture with both extension components and a web application, using modern React/TypeScript with AI integration via OpenAI's GPT-4o model.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The system uses a **dual frontend approach**:
- **Browser Extension UI**: Built with Plasmo framework, React, and Tailwind CSS for popup and content script interfaces
- **Web Application**: Traditional React SPA with Vite bundler for dashboard/admin interfaces
- **Shared Components**: Reusable UI components using Radix UI primitives and shadcn/ui component library

### Backend Architecture
The backend follows a **Node.js/Express microservice pattern**:
- **Express Server**: RESTful API server with TypeScript
- **Database Layer**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: PostgreSQL-based session storage with connect-pg-simple
- **Background Processing**: Chrome extension background service for AI analysis and data extraction

### Browser Extension Architecture
- **Content Scripts**: Platform-specific data extraction for each broker (Zerodha, Groww, AngelOne)
- **Background Service**: Centralized AI analysis and pattern detection service
- **Popup Interface**: Quick access control panel with settings and status
- **Sidebar Injection**: Real-time analysis overlay on broker websites

## Key Components

### Data Extraction Service
- **Purpose**: Extract stock data from different broker platforms
- **Implementation**: Platform-specific scrapers using DOM parsing
- **Supported Platforms**: Zerodha Kite, Groww, AngelOne
- **Data Types**: Price data, technical indicators, fundamentals, candlestick patterns

### AI Analysis Service
- **Model**: Google Gemini 2.5 Flash for intelligent market analysis
- **Functions**: Pattern recognition, trade recommendations, market insights
- **Input**: Extracted stock data, technical indicators, news sentiment
- **Output**: JSON-formatted analysis with confidence scores and actionable insights

### Pattern Detection Service
- **Algorithm**: Custom candlestick pattern recognition
- **Patterns**: Doji, Hammer, Engulfing, Shooting Star, Morning/Evening Star
- **Confidence Scoring**: Mathematical confidence calculations for each pattern
- **Real-time Analysis**: Continuous monitoring of chart patterns

### Storage Management
- **Extension Storage**: Chrome storage API for user preferences and settings
- **Database Storage**: PostgreSQL for historical data and user analysis
- **Session Storage**: Temporary data for active trading sessions

## Data Flow

1. **Data Collection**: Content scripts extract real-time market data from broker platforms
2. **Pattern Analysis**: Background service processes candlestick data for pattern recognition
3. **AI Processing**: Gemini API analyzes combined data for trading insights
4. **UI Presentation**: Results displayed in sidebar overlay and popup interface
5. **User Interaction**: Chat interface allows users to ask specific questions about stocks
6. **Persistence**: Analysis results and user preferences stored for future reference

## External Dependencies

### Core Dependencies
- **Google Gemini API**: Gemini 2.5 Flash model for intelligent analysis (primary AI service)
- **Chrome Extension APIs**: Storage, tabs, scripting for browser integration
- **Neon Database**: PostgreSQL hosting service via @neondatabase/serverless

### UI Framework
- **React 18**: Component-based UI framework
- **Tailwind CSS**: Utility-first styling framework
- **Radix UI**: Accessible component primitives
- **shadcn/ui**: Pre-built component library

### Development Tools
- **Plasmo**: Browser extension development framework
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type-safe development
- **Drizzle ORM**: Type-safe database operations

### Third-party Services
- **Broker Platforms**: Zerodha Kite, Groww, AngelOne (data source)
- **Google Gemini**: AI analysis and chat functionality
- **Chrome Web Store**: Extension distribution

## Deployment Strategy

### Extension Distribution
- **Chrome Web Store**: Primary distribution channel for browser extension
- **Manifest V3**: Modern extension architecture with enhanced security
- **Permissions**: Minimal required permissions (storage, activeTab, scripting)
- **Host Permissions**: Specific broker platform domains only

### Web Application
- **Build Process**: Vite production build with TypeScript compilation
- **Static Assets**: Optimized bundle with code splitting
- **Express Server**: Production deployment with esbuild bundling
- **Environment Variables**: DATABASE_URL for PostgreSQL connection

### Database Schema
- **Users Table**: Basic user management with username/password
- **Analysis Storage**: Historical analysis data and patterns
- **Session Management**: PostgreSQL-based session storage
- **Migration Strategy**: Drizzle Kit for schema versioning

### Security Considerations
- **API Key Management**: Secure storage of Gemini API keys in extension storage
- **CORS Configuration**: Proper cross-origin policies for extension communication
- **Content Security Policy**: Restricted script execution for extension pages
- **Data Privacy**: Local processing where possible, minimal data transmission

## Recent Changes: Latest modifications with dates

### January 19, 2025
- ✅ **Complete StockSense AI Extension Built**: Successfully created full Chrome extension with React + Plasmo framework
- ✅ **Google Gemini AI Integration**: Replaced OpenAI with Gemini 2.5 Flash for intelligent stock analysis per user preference
- ✅ **Multi-Platform Content Scripts**: Built content scripts for Zerodha Kite, Groww, and AngelOne trading platforms
- ✅ **Real-time Pattern Detection**: Implemented candlestick pattern algorithms (Doji, Hammer, Engulfing patterns)
- ✅ **Interactive Floating Sidebar**: Created non-intrusive UI with analysis cards, chat interface, and learning mode
- ✅ **Technical Indicators**: Added RSI, MACD, moving averages with visual displays and trend analysis
- ✅ **Educational Learning Mode**: Toggle overlay showing pattern names and explanations on charts
- ✅ **Comprehensive Documentation**: Created detailed README with setup instructions and troubleshooting guide
- ✅ **Test Environment**: Built test-page.html for easy extension testing with mock stock data

### Extension Status: ✅ Ready for deployment and Chrome Web Store submission