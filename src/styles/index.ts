
/* Main styles entry point - imports all style files */

// All CSS files with @layer directives must be imported after the main index.css file
// which contains the @tailwind directives

// Base styles
import './base.css';

// Component styles
import './components.css';
import './glassmorphism.css';
import './animations.css';

// Theme styles should be imported last to override any previous styles
import './admin-styles.css';
import './designer-styles.css';
import './client-styles.css';
