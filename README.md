# StockSense AI - Intelligent Trading Assistant

An AI-powered Chrome Extension that provides intelligent buy/sell recommendations and interactive chat for stock analysis on Indian trading platforms (Zerodha Kite, Groww, AngelOne).

## Features

✅ **Real-time Stock Analysis**: Detects current stock pages and extracts live market data  
✅ **AI-Powered Recommendations**: Uses Google Gemini 2.5 Flash for intelligent trading insights  
✅ **Candlestick Pattern Detection**: Identifies Doji, Hammer, Engulfing, and other patterns  
✅ **Interactive Chat**: Ask questions about stocks and get AI-powered responses  
✅ **Learning Mode**: Educational overlay showing pattern names on charts  
✅ **Multi-Platform Support**: Works on Zerodha Kite, Groww, and AngelOne  
✅ **Clean UI**: Non-intrusive floating sidebar with modern design  

## Quick Start

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key (starts with "AIza...")

### 2. Install the Extension

#### Development Mode (Recommended for Testing)
```bash
# Clone and setup
git clone <your-repo>
cd stocksense-ai
npm install

# Start development server
npm run dev

# Build extension
npx plasmo build --target=chrome-mv3
```

#### Load in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right toggle)
3. Click "Load unpacked"
4. Select the `build/chrome-mv3-dev` folder

### 3. Configure API Key
1. Click the StockSense AI extension icon
2. Go to Settings
3. Enter your Gemini API key
4. Save settings

### 4. Test the Extension
1. Open the included `test-page.html` in Chrome
2. The StockSense AI sidebar should appear automatically
3. Try the Learning Mode toggle to see pattern overlays
4. Use the chat interface to ask questions about the stock

## Supported Platforms

| Platform | Status | URL Pattern |
|----------|--------|-------------|
| Zerodha Kite | ✅ Supported | `https://kite.zerodha.com/*` |
| Groww | ✅ Supported | `https://groww.in/*` |
| AngelOne | ✅ Supported | `https://web.angelone.in/*` |

## Architecture

### Core Components
- **Background Service**: Handles AI analysis and pattern detection
- **Content Scripts**: Extract stock data from broker platforms
- **Floating Sidebar**: Real-time analysis display and chat interface
- **Pattern Overlay**: Educational mode for pattern visualization

### AI Analysis Pipeline
1. **Data Extraction**: Scrapes stock data from trading platforms
2. **Technical Analysis**: Calculates RSI, MACD, moving averages
3. **Pattern Detection**: Identifies candlestick patterns with confidence scores
4. **AI Processing**: Gemini analyzes combined data for trading insights
5. **Recommendation Generation**: Provides BUY/SELL/HOLD with reasoning

### Technology Stack
- **Framework**: Plasmo (Chrome Extension framework)
- **Frontend**: React + TypeScript + Tailwind CSS
- **AI Service**: Google Gemini 2.5 Flash
- **Storage**: Chrome Extension Storage API
- **Build Tool**: Vite

## Extension Features

### Analysis Card
- Detected pattern name and confidence
- Trading recommendation (BUY/SELL/HOLD/WAIT)
- Risk level and timeframe
- Key support/resistance levels

### Technical Indicators
- RSI with visual bar and overbought/oversold signals
- MACD with trend direction
- Moving averages (20, 50 day) with price comparison
- Volume analysis

### Fundamentals Display
- P/E ratio with valuation assessment
- EPS, Market Cap, Book Value
- Debt/Equity ratio with risk indicators
- ROE with profitability rating

### Interactive Chat
- Ask specific questions about stocks
- Context-aware responses based on current analysis
- Chat history management
- Real-time AI responses

### Learning Mode
- Toggle overlay showing pattern names on charts
- Educational tooltips and explanations
- Pattern confidence scores
- Visual pattern indicators

## Development

### Project Structure
```
├── background/           # Service worker scripts
├── contents/            # Content scripts for each platform
├── components/          # Reusable UI components
├── lib/                # Core services (AI, patterns, data extraction)
├── assets/             # Icons and static assets
├── styles/             # Global CSS styles
└── types/              # TypeScript type definitions
```

### Key Services

#### AIAnalysisService (`lib/ai-analysis.ts`)
- Integrates with Google Gemini API
- Provides stock analysis and chat functionality
- Handles JSON response parsing and error management

#### PatternDetectionService (`lib/pattern-detection.ts`)
- Detects candlestick patterns using mathematical algorithms
- Calculates technical indicators (RSI, MACD, MA)
- Provides confidence scoring for patterns

#### DataExtractionService (`lib/data-extraction.ts`)
- Platform-specific data scrapers
- Extracts price, fundamentals, and chart data
- Handles multiple broker website structures

### Adding New Brokers

1. Create content script in `contents/` directory
2. Add selectors in `DataExtractionService`
3. Update host permissions in `plasmo.config.ts`
4. Test data extraction and analysis

## Security & Privacy

- API keys stored securely in Chrome Extension storage
- No data transmission to external servers (except AI analysis)
- Content Security Policy restrictions
- Minimal required permissions
- Local pattern detection and technical analysis

## Performance

- Real-time analysis updates every 30 seconds
- Efficient DOM querying with caching
- Lazy loading of components
- Optimized bundle size with code splitting

## Troubleshooting

### Extension Not Working
1. Check if you're on a supported trading platform
2. Verify API key is configured in settings
3. Refresh the page and check for errors in console

### API Errors
1. Verify Gemini API key is valid
2. Check API quota and usage limits
3. Ensure internet connection is stable

### Missing Analysis Data
1. Check if stock data is being extracted properly
2. Verify chart container is detected
3. Try refreshing the page

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on supported platforms
5. Submit a pull request

## Disclaimer

This extension is for educational and informational purposes only. Not financial advice. Always do your own research before making investment decisions.