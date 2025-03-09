import { useState, useEffect } from 'react';

const TextPref = () => {
    const [selectedSize, setSelectedSize] = useState<'small' | 'normal' | 'large'>('normal');

  // Persist the text size choice in localStorage
    useEffect(() => {
        const savedSize = localStorage.getItem('textSize') as 'small' | 'normal' | 'large' | null;
        if (savedSize) {
            setSelectedSize(savedSize);
        }
    }, []);

    // Handle the radio button change event
    const handleSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const size = event.target.value as 'small' | 'normal' | 'large';
        setSelectedSize(size);
        localStorage.setItem('textSize', size); // Save the selected text size to localStorage
    };

    // Apply the selected text size to the body by adding the appropriate class
    useEffect(() => {
    // Remove all text size classes first
    document.body.classList.remove('small-text', 'normal-text', 'large-text');

    switch (selectedSize) {
        case 'small':
            document.body.classList.add('small-text');
            break;
        case 'normal':
            document.body.classList.add('normal-text');
            break;
        case 'large':
            document.body.classList.add('large-text');
            break;
        default:
            document.body.classList.add('normal-text');
        }
    }, [selectedSize]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Select Text Size</h2>
            <label>
                <input type="radio" value="small" checked={selectedSize === 'small'} onChange={handleSizeChange} />
                Small
            </label>
            <label>
                <input type="radio" value="normal" checked={selectedSize === 'normal'} onChange={handleSizeChange} />
                Normal
            </label>
            <label>
                <input type="radio" value="large" checked={selectedSize === 'large'} onChange={handleSizeChange} />
                Large
            </label>

            <p>Selected Text Size: {selectedSize}</p>
        </div>
    );
};

export default TextPref;
