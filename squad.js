        // Firebase configuration
        const firebaseConfig = {
            apiKey: "AIzaSyDUn7tzUwZ4k6IJm3uDB9H9NrPkSDEn8Bs",
            authDomain: "soclikes-bef01.firebaseapp.com",
            projectId: "soclikes-bef01",
            storageBucket: "soclikes-bef01.firebasestorage.app",
            messagingSenderId: "835011562960",
            appId: "1:835011562960:web:b5c12111482b8059f93dd5",
            measurementId: "G-EMCVFK5DMV"
        };

        // App state
        const state = {
            likesCount: 250, // Default to 250 likes
            userLiked: false,
            userId: null,
            carouselInterval: null,
            currentSlide: 0
        };

        // DOM elements
        const elements = {
            app: document.getElementById('app'),
            loading: document.getElementById('loading'),
            likeButton: null,
            likeCount: null,
            carousel: null,
            carouselDots: null
        };

        // Carousel images with placeholder fallbacks
        const carouselImages = [{
                src: '_DSC3031-1-1.jpg',
                alt: 'Socratic Squad members',
                placeholder: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjYiPlNvY3JhdGljIFNxdWFkIE1lbWJlcnM8L3RleHQ+PC9zdmc+'
            },
            {
                src: '_DSC3033.jpg',
                alt: 'Socratic Squad gathering',
                placeholder: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjYiPlNvY3JhdGljIFNxdWFkIEdhdGhlcmluZzwvdGV4dD48L3N2Zz4='
            },
            {
                src: '_DSC3028.jpg',
                alt: 'Socratic Squad having fun',
                placeholder: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjYiPlNvY3JhdGljIFNxdWFkIEhhdmluZyBGdW48L3RleHQ+PC9zdmc+'
            }
        ];

        // Initialize Firebase
        function initializeFirebase() {
            return new Promise((resolve, reject) => {
                try {
                    // Check if Firebase is already initialized
                    if (firebase.apps.length === 0) {
                        firebase.initializeApp(firebaseConfig);
                    }

                    // Enable Firestore persistence
                    firebase.firestore().enablePersistence()
                        .catch(err => {
                            console.warn('Firestore persistence failed:', err);
                        });

                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        }

        // Create header component
        function createHeader() {
            const header = document.createElement('header');
            header.className = 'physics-animation';

            const backButton = document.createElement('button');
            backButton.className = 'back-button';
            backButton.setAttribute('aria-label', 'Back');
            backButton.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            `;

            backButton.addEventListener('click', () => {
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    setTimeout(() => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html'; 
        }
    }, 300);
});

            const headerTitle = document.createElement('div');
            headerTitle.className = 'header-title';
            headerTitle.textContent = 'Socratic Squad';

            header.appendChild(backButton);
            header.appendChild(headerTitle);

            return header;
        }

        // Create carousel component
        function createCarousel() {
            const carouselContainer = document.createElement('div');
            carouselContainer.className = 'image-carousel physics-animation';

            const carousel = document.createElement('div');
            carousel.className = 'carousel-container';
            carousel.id = 'carousel';
            elements.carousel = carousel;

            // Add slides with lazy loading and placeholders
            carouselImages.forEach((image, index) => {
                const slide = document.createElement('div');
                slide.className = 'carousel-slide';

                const img = document.createElement('img');
                img.className = 'carousel-image';
                img.src = image.placeholder;
                img.alt = image.alt;
                img.loading = index === 0 ? 'eager' : 'lazy';
                img.decoding = 'async';

                // Load the actual image after the placeholder is displayed
                setTimeout(() => {
                    const tempImg = new Image();
                    tempImg.src = image.src;
                    tempImg.onload = () => {
                        img.src = image.src;
                    };
                    tempImg.onerror = () => {
                        console.warn(`Failed to load image: ${image.src}`);
                    };
                }, index * 300);

                slide.appendChild(img);
                carousel.appendChild(slide);
            });

            // Create navigation dots
            const nav = document.createElement('div');
            nav.className = 'carousel-nav';

            carouselImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => {
                    scrollToSlide(index);
                });
                nav.appendChild(dot);
            });

            // Store dots for later reference
            elements.carouselDots = nav.querySelectorAll('.carousel-dot');

            // Set up carousel scrolling
            carousel.addEventListener('scroll', () => {
                const slideWidth = carousel.clientWidth;
                state.currentSlide = Math.round(carousel.scrollLeft / slideWidth);

                elements.carouselDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === state.currentSlide);
                });
            });

            // Start auto-advancing
            startCarousel();

            // Pause on interaction
            carousel.addEventListener('mouseenter', stopCarousel);
            carousel.addEventListener('mouseleave', startCarousel);
            carousel.addEventListener('touchstart', stopCarousel);
            carousel.addEventListener('touchend', startCarousel);

            carouselContainer.appendChild(carousel);
            carouselContainer.appendChild(nav);

            return carouselContainer;
        }

        // Start auto-advancing carousel
        function startCarousel() {
            stopCarousel(); // Clear any existing interval
            state.carouselInterval = setInterval(() => {
                state.currentSlide = (state.currentSlide + 1) % carouselImages.length;
                scrollToSlide(state.currentSlide);
            }, 5000);
        }

        // Stop auto-advancing carousel
        function stopCarousel() {
            if (state.carouselInterval) {
                clearInterval(state.carouselInterval);
                state.carouselInterval = null;
            }
        }

        // Scroll to specific slide
        function scrollToSlide(index) {
            if (elements.carousel) {
                elements.carousel.scrollTo({
                    left: elements.carousel.clientWidth * index,
                    behavior: 'smooth'
                });
            }
        }

        // Create content section
        function createContent() {
            const content = document.createElement('div');
            content.className = 'content';

            // Add title
            const title = document.createElement('h1');
            title.className = 'title physics-animation';
            title.textContent = 'Socratic Squad';

            // Add quote
            const quote = document.createElement('blockquote');
            quote.className = 'quote';
            quote.innerHTML = '<strong>"All for one. One for all."</strong>';

            // Add divider
            const divider = document.createElement('hr');

            // Add description
            const description = document.createElement('p');
            description.className = 'description physics-animation';
            description.innerHTML = `
                Socratic Squad is not just a group. It's a connection between people who started as classmates or strangers but became close through shared stories, laughs, and late-night talks. We are a group of six who support each other, not just in school but in life. Each of us brings something different to the table. Some of us love to ask questions, others love to answer them. Some are quiet, some are loud, but all of us listen and show up for one another.

                <br><br>We've had random talks that turned into deep conversations, simple jokes that turned into inside ones, and regular days that turned into lasting memories. Even when we disagree or challenge each other's ideas, it's done with respect and care. That's what makes this group special. It's not always about fun or being serious. It's about having people around who understand you, who remind you that you're not alone, and who make even ordinary moments feel important.

                <br><br>Whether we're working on a project, sharing food, or just sitting in silence together, it always means something. This is friendship that grows, changes, and stays. This is Socratic Squad.
            `;

            // Add action buttons
            const actionButtons = document.createElement('div');
            actionButtons.className = 'action-buttons physics-animation';

            const likeButton = document.createElement('button');
            likeButton.className = 'like-button';
            likeButton.id = 'likeButton';
            likeButton.innerHTML = `
                <i class="far fa-heart"></i>
                <span class="like-count" id="likeCount">${state.likesCount}</span>
                <span class="sr-only">likes</span>
            `;
            likeButton.addEventListener('click', toggleLike);

            // Store button references
            elements.likeButton = likeButton;
            elements.likeCount = likeButton.querySelector('.like-count');

            actionButtons.appendChild(likeButton);

            // Add elements to content
            content.appendChild(title);
            content.appendChild(quote);
            content.appendChild(divider);
            content.appendChild(description);
            content.appendChild(actionButtons);

            return content;
        }

        // Update like button appearance
        function updateLikeButton() {
            if (elements.likeButton && elements.likeCount) {
                elements.likeCount.textContent = state.likesCount;

                if (state.userLiked) {
                    elements.likeButton.classList.add('liked');
                    elements.likeButton.innerHTML = `
                        <i class="fas fa-heart"></i>
                        <span class="like-count" id="likeCount">${state.likesCount}</span>
                        <span class="sr-only">likes</span>
                    `;
                } else {
                    elements.likeButton.classList.remove('liked');
                    elements.likeButton.innerHTML = `
                        <i class="far fa-heart"></i>
                        <span class="like-count" id="likeCount">${state.likesCount}</span>
                        <span class="sr-only">likes</span>
                    `;
                }

                // Update the references after DOM update
                elements.likeCount = elements.likeButton.querySelector('.like-count');
            }
        }

        // Toggle like function
        async function toggleLike() {
            if (!state.userId) {
                console.error('User not authenticated');
                return;
            }

            try {
                const docRef = firebase.firestore().collection('squad').doc('socratic');
                const likesRef = docRef.collection('likes').doc(state.userId);

                if (state.userLiked) {
                    // Remove like
                    await firebase.firestore().runTransaction(async (transaction) => {
                        const doc = await transaction.get(docRef);
                        const currentLikes = doc.data().likes || 0;
                        transaction.update(docRef, {
                            likes: currentLikes - 1
                        });
                        transaction.delete(likesRef);
                    });

                    state.userLiked = false;
                    state.likesCount--;
                } else {
                    // Add like
                    await firebase.firestore().runTransaction(async (transaction) => {
                        const doc = await transaction.get(docRef);
                        const currentLikes = doc.data().likes || 0;
                        transaction.update(docRef, {
                            likes: currentLikes + 1
                        });
                        transaction.set(likesRef, {
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            userId: state.userId
                        });
                    });

                    state.userLiked = true;
                    state.likesCount++;
                }

                updateLikeButton();
            } catch (error) {
                console.error('Error toggling like:', error);
                elements.likeButton.classList.add('error');
                setTimeout(() => {
                    elements.likeButton.classList.remove('error');
                }, 1000);
            }
        }

        // Initialize app data from Firestore
        async function initializeAppData() {
            try {
                // Sign in anonymously
                await firebase.auth().signInAnonymously();
                state.userId = firebase.auth().currentUser?.uid;

                if (!state.userId) {
                    throw new Error('Anonymous authentication failed');
                }

                const docRef = firebase.firestore().collection('squad').doc('socratic');
                const doc = await docRef.get();

                if (doc.exists) {
                    const data = doc.data();
                    state.likesCount = data.likes || 250; // Fallback to 250 if not set

                    // Check if user has already liked
                    const likesRef = docRef.collection('likes').doc(state.userId);
                    const likeDoc = await likesRef.get();
                    state.userLiked = likeDoc.exists;

                    updateLikeButton();
                } else {
                    // Initialize document if it doesn't exist
                    await docRef.set({
                        likes: 250, // Start with 250 likes
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }

                // Set up real-time listener for likes
                docRef.onSnapshot((doc) => {
                    if (doc.exists) {
                        const newCount = doc.data().likes || 250;
                        if (newCount !== state.likesCount) {
                            state.likesCount = newCount;
                            updateLikeButton();
                        }
                    }
                });
            } catch (error) {
                console.error('Initialization error:', error);
                // Fallback to default values
                state.likesCount = 250;
                updateLikeButton();
            }
        }

        // Render the entire app
        function renderApp() {
            elements.app.innerHTML = '';

            const header = createHeader();
            const carousel = createCarousel();
            const content = createContent();

            elements.app.appendChild(header);
            elements.app.appendChild(carousel);
            elements.app.appendChild(content);

            // Animate elements in sequence
            const physicsElements = document.querySelectorAll('.physics-animation');
            physicsElements.forEach((el, index) => {
                el.style.transitionDelay = `${index * 0.05}s`;
            });
        }

        // Hide loading spinner
        function hideLoading() {
            elements.loading.style.opacity = '0';
            setTimeout(() => {
                elements.loading.style.display = 'none';
            }, 300);
        }

        // Initialize the app
        async function initApp() {
            try {
                await initializeFirebase();
                await initializeAppData();
                renderApp();

                // Hide loading after everything is ready
                setTimeout(hideLoading, 500);
            } catch (error) {
                console.error('App initialization failed:', error);
                // Render app even if Firebase fails
                renderApp();
                hideLoading();
            }
        }

        // Start the app when everything is loaded
        document.addEventListener('DOMContentLoaded', initApp);

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            stopCarousel();
        });