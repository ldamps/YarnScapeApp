// This file handles the service worker registration logic

// This is the code that checks if the browser supports service workers and registers the service worker.
/*const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname === '127.0.0.1'
);*/

export function register() {
    if (process.env.NODE_ENV === 'production') {
        const publicUrl = new URL(
            window.location.href
        );
    
        if (publicUrl.hostname === 'localhost') {
            return;
        }
    
        // Ensure service worker is only registered in production, and is not cached in development.
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
            //.register('/service-worker.js')  // Path to your service worker
            .register(`${process.env.PUBLIC_URL}/service-worker.js`)
            .then((registration) => {
                console.log('Service Worker registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('Service Worker registration failed: ', registrationError);
            });
        }
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
        .then((registration) => {
            registration.unregister();
        })
        .catch((error) => {
            console.error(error.message);
        });
    }
}