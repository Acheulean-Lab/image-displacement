// include pixi.js in index 
// <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/5.3.3/pixi.min.js"></script> 
       

let displacementSprite; // Global variable for displacement sprite

    // Function to check if the user is on a mobile device
    function isMobileDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    }

    const isMobile = isMobileDevice();
    
    // Initialize PIXI application
    const container = document.getElementById('canvas-container');
    const app = new PIXI.Application({ width: 600, height: 600, transparent: true });
    container.appendChild(app.view);

    // Load resources
    const loader = PIXI.Loader.shared;
    const imageUrl1 = 'url for your image'; // Replace with the URL for your image
    const imageUrl2 = 'url for your texture'; // Replace with the URL for your texture

    loader.add('image1', imageUrl1).add('image2', imageUrl2);

    loader.onProgress.add((loader) => {
        console.log(`Loading progress: ${loader.progress}%`);
    });

    loader.onError.add((error, loader, resource) => {
        console.error(`Error loading ${resource.name}: ${error}`);
    });

    loader.onComplete.add((loader, resources) => {
        console.log('All resources loaded successfully');
        const imgTexture = resources.image1.texture;
        const textTexture = resources.image2.texture;

        displayTexture(imgTexture, app, textTexture, 1);
        displayTexture(textTexture, app, textTexture, 2);
    });

    loader.load();

    // Function to display texture
    function displayTexture(texture, app, textTexture, index) {
        if (index === 1) {
            const sprite = new PIXI.Sprite(texture);
            const aspectRatio = texture.orig.width / texture.orig.height;

            sprite.width = app.screen.width;
            sprite.height = app.screen.width / aspectRatio;
            sprite.alpha = 0.8;

            app.stage.addChild(sprite);
        } else if (index === 2 && textTexture) {
            displacementSprite = new PIXI.Sprite(texture);
            const displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
            const randomScale = Math.random() * (160 - 75) + 75;

            displacementFilter.scale.set(randomScale);

            displacementSprite.anchor.set(0.5);
            displacementSprite.width = app.screen.width;
            displacementSprite.height = app.screen.height;

            app.stage.addChild(displacementSprite);
            app.stage.filters = [displacementFilter];

            displacementSprite.scale.set(40.1);
            displacementSprite.position.set(-44, 140);

            document.addEventListener('mousemove', followMouse);

            if (isMobile) {
                console.log("Mobile device detected");
                wiggleAnimation();
            }
        }
    }

    // Function to animate follow mouse 
    function followMouse(event) {
        const motionScale = -0.02;
        const easing = 1.5;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        displacementSprite.x += (mouseX * motionScale - 44 - displacementSprite.x) * easing;
        displacementSprite.y += (mouseY * motionScale + 140 - displacementSprite.y) * easing;
    }

    // Function for mobile wiggle animation 
    function wiggleAnimation() {
        let time = 0;
        const maxWiggleAmplitude = 65; // Maximum intensity of the wiggle
        const wiggleSpeed = 0.002; // Controls wiggle speed

        function animate() {
            displacementSprite.x = -30 + maxWiggleAmplitude * 0.5 * Math.sin(time);
            displacementSprite.y = 140 + maxWiggleAmplitude * Math.cos(time);

            time += wiggleSpeed;
            requestAnimationFrame(animate);
        }

        animate(); // Start the animation
    }
