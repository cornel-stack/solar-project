# SolarAfrica Planner

A comprehensive Next.js frontend application for solar energy planning and financial modeling tailored for the African market.

## Features

- **Landing Page**: Hero section with call-to-action and feature highlights
- **Multi-step Calculator**: 3-step solar planning wizard
  - Category selection (Home, Business, Farm)
  - Details input (location, devices, usage)
  - Results dashboard with charts and financial analysis
- **Authentication**: Sign up/login with social media integration
- **Dashboard**: Saved solar plans management
- **About Page**: Mission, challenge, and impact information
- **FAQ & Contact**: Support and information pages
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── about/
│   ├── auth/
│   ├── calculator/
│   ├── contact/
│   ├── dashboard/
│   ├── faq/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/             # Reusable components
│   ├── calculator/         # Calculator-specific components
│   ├── AuthForm.tsx
│   ├── CostBreakdown.tsx
│   ├── CTA.tsx
│   ├── FAQ.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Layout.tsx
│   ├── PaybackTimeline.tsx
│   └── SolarPlanSummary.tsx
├── docs/                   # Design assets and documentation
├── next.config.js
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Key Components

### Calculator Flow
- **CategoryStep**: Choose between Home, Business, or Farm
- **DetailsStep**: Input location, sunlight hours, and device details
- **ReviewStep**: Display calculated solar plan with charts

### Dashboard Components
- **SolarPlanSummary**: System specifications display
- **CostBreakdown**: Interactive pie chart for cost analysis
- **PaybackTimeline**: ROI visualization over 20 years

### Layout Components
- **Header**: Navigation with responsive mobile menu
- **Footer**: Company information and links
- **Layout**: Main layout wrapper with header and footer

## Design Features

- **African-themed**: Sunset gradients, earth tones, and African imagery
- **Responsive**: Mobile-first design with breakpoints
- **Accessible**: WCAG compliance with proper contrast and navigation
- **Interactive**: Smooth transitions, hover effects, and animations
- **Modern**: Clean, professional design with rounded corners and shadows

## Solar Calculation Logic

The calculator uses industry-standard formulas:
- **Daily Energy Consumption**: Device power × quantity × hours per day
- **Panel Sizing**: Energy demand ÷ sunlight hours
- **Battery Capacity**: 2 days backup capacity
- **Financial Modeling**: ROI, payback period, and 20-year projections

## Deployment

The application is configured for easy deployment on Vercel:

```bash
npm run build
npm start
```

## Environment Variables

Create a `.env.local` file for any required environment variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@solarafrica.com or visit our contact page.