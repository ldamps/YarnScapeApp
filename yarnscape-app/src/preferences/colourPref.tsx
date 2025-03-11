// Colour preference for YarnScape pages

import { useState, useEffect } from 'react';

const ColorPref = () => {
  // Default theme is light
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // On component mount, load the theme preference from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    // Change theme and save the preference to localStorage
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);  // Save theme preference
    };

    // Apply the theme to the document body
    useEffect(() => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
    }, [theme]);

    return (
        <div className="colourPref-container">
            <label>
                <input type="radio" value="light-mode" checked={theme === 'light'} onChange={toggleTheme} />
                Light
            </label>
            <label>
                <input type="radio" value="dark-mode" checked={theme === 'dark'} onChange={toggleTheme} />
                Dark
            </label>
        </div>
    );
};

export default ColorPref;
