import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and core libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // UI chunk for icons and styling
          ui: ['react-icons', 'react-toastify'],
          
          // Charts chunk for analytics
          charts: ['chart.js', 'react-chartjs-2', 'recharts'],
          
          // Utils chunk for date handling and other utilities
          utils: ['date-fns'],
          
          // Admin chunk for heavy admin components
          admin: [
            './src/pages/AdminDashboard.jsx',
            './src/pages/AdminUsersPage.jsx',
            './src/pages/AdminOrdersPage.jsx',
            './src/pages/AnalyticsDashboard.jsx'
          ],
          
          // Shopping chunk for e-commerce components
          shopping: [
            './src/pages/CartPage.jsx',
            './src/pages/CheckoutPage.jsx',
            './src/pages/SearchProductPage.jsx',
            './src/pages/ProductDetail.jsx',
            './src/pages/OrderConfirmation.jsx'
          ],
          
          // Product management chunk
          products: [
            './src/pages/CreateProduct.jsx',
            './src/pages/EditProduct.jsx'
          ]
        }
      }
    },
    
    // Set chunk size warning limit to 1000kb (from default 500kb)
    chunkSizeWarningLimit: 1000,
    
    // Enable source maps for better debugging
    sourcemap: true,
    
    // Use esbuild minifier (faster and included by default)
    minify: 'esbuild',
    
    // Optimize for modern browsers
    target: 'es2020',
    
    // Enable CSS code splitting
    cssCodeSplit: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'react-icons/fa',
      'react-toastify',
      'date-fns'
    ]
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  
  // Preview server configuration
  preview: {
    port: 3000,
    open: true
  }
})
