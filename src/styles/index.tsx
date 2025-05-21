
// Import all CSS files to ensure they're loaded in the correct order
import './base.css';
import './components.css';
import './admin-styles.css';
import './designer-styles.css';
import './client-styles.css';
import './glassmorphism.css';
import './animations.css';
import './role-specific-theme.css';
import './admin-theme.css'; // Make sure admin-theme.css is explicitly imported

// Export any theme or style utilities that might be needed elsewhere
export * from './admin-theme';

// This is a React component that doesn't render anything visible
// but ensures all styles are properly loaded
const Styles = () => null;
export default Styles;
