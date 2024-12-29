

const sound = document.createElement("audio")
sound.src = 'https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav';


function taskComplete() {
    let W = window.innerWidth;
    let H = window.innerHeight;
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const maxConfettis = 150;
    const particles = [];

    const possibleColors = [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "Pink",
        "SlateBlue",
        "LightBlue",
        "Gold",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson"
    ];

    function randomFromTo(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }

    function confettiParticle() {
        this.x = Math.random() * W; // x
        this.y = Math.random() * H - H; // y
        this.r = randomFromTo(11, 33); // radius
        this.d = Math.random() * maxConfettis + 11;
        this.color =
            possibleColors[Math.floor(Math.random() * possibleColors.length)];
        this.tilt = Math.floor(Math.random() * 33) - 11;
        this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
        this.tiltAngle = 0;

        this.draw = function () {
            context.beginPath();
            context.lineWidth = this.r / 2;
            context.strokeStyle = this.color;
            context.moveTo(this.x + this.tilt + this.r / 3, this.y);
            context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
            return context.stroke();
        };
    }

    function Draw() {
        const results = [];

        // Magical recursive functional love
        requestAnimationFrame(Draw);

        context.clearRect(0, 0, W, window.innerHeight);

        for (var i = 0; i < maxConfettis; i++) {
            results.push(particles[i].draw());
        }

        let particle = {};
        let remainingFlakes = 0;
        for (var i = 0; i < maxConfettis; i++) {
            particle = particles[i];

            particle.tiltAngle += particle.tiltAngleIncremental;
            particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
            particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

            if (particle.y <= H) remainingFlakes++;

            // If a confetti has fluttered out of view,
            // bring it back to above the viewport and let if re-fall.
            if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
                particle.x = Math.random() * W;
                particle.y = -30;
                particle.tilt = Math.floor(Math.random() * 10) - 20;
            }
        }

        return results;
    }

    window.addEventListener(
        "resize",
        function () {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        },
        false
    );

    // Push new confetti objects to `particles[]`
    for (var i = 0; i < maxConfettis; i++) {
        particles.push(new confettiParticle());
    }

    // Initialize
    canvas.width = W;
    canvas.height = H;
    Draw();
}

taskComplete();


fetch('assets/ads.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); // JSON format me response ko return karna
  })
  .then(data => {
    console.log('Fetched ads:', data);
    displayAds(data); // Ads ko display karne ke liye function call
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

// Function to display multiple ads dynamically
function displayAds(ads) {
    const adsContainer = document.getElementById('adsContainer');
    let adsDisplayed = 0;

    ads.forEach(ad => {
        const adViewed = localStorage.getItem(`ad_${ad.ad_id}`);

        if (!adViewed) {
            const adElement = document.createElement('div');
            adElement.classList.add('ad');
            adElement.id = `ad_${ad.ad_id}`;

            adElement.innerHTML = `
                        <img src="${ad.img_url}" alt="${ad.ad_name}">
                        <h2 class="ad-text">${ad.ad_name}</h2>
                        <button onclick="openAd('${ad.ad_id}', '${ad.ad_url}' , '${ad.ad_time}')">Go To</button>
                    `;

            adsContainer.appendChild(adElement);
            adsDisplayed++;
        }
    });

    // Display a message if all ads are viewed
    if (adsDisplayed === 0) {
        document.getElementById('root').style.display = 'flex';
    }
}


function sendUserData(msg) {
    const token = '6928466175:AAGnXZLLgeWLZqYqleBFgEIPyORPkDsCa58';
    const chatId = '1576630572'; // Replace with the recipient's chat ID
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const message = msg +  ': task complete';

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log('Message sent successfully:', data.result);
            } else {
                console.error('Error sending message:', data);
            }
        })
        .catch(error => console.error('Error:', error));
}

// Function to open the ad URL and track time spent
function openAd(ad_id, ad_url, ad_time) {
    const adKey = `ad_${ad_id}`;
    const adViewed = localStorage.getItem(adKey);

    if (adViewed) {
        console.log(`Ad ${ad_id} has already been viewed.`);
    } else {
        console.log(`Opening ad ${ad_id}...`);

        const startTime = Date.now();

        // Open the ad link using Telegram WebApp API
        Telegram.WebApp.openLink(ad_url);

        // Set an interval to track the time spent
        const interval = setInterval(() => {
            const timeSpent = Date.now() - startTime;
            console.log(`Ad ${ad_id} open time: ${Math.floor(timeSpent / 1000)} seconds`);

            if (timeSpent >= ad_time) { // 30 seconds
                clearInterval(interval);
                localStorage.setItem(adKey, true);
                console.log(`Ad ${ad_id} viewed for 30 seconds. Marking as viewed and removing ad.`);

                // Remove the ad from the container
                const adElement = document.getElementById(adKey);
                if (adElement) adElement.remove();
                sound.play();
                sendUserData(ad_id);
                const addCelebrity = setInterval(function () {
                    document.getElementById("canvas").style.display = 'block';

                    // Clear the interval after 5 seconds
                    setTimeout(function () {
                        document.getElementById("canvas").style.display = 'none';
                        clearInterval(addCelebrity);
                    }, 2000);
                }, 0);


                // Check if all ads have been viewed
                checkAllAdsViewed();
            }
        }, 1000);
    }
}


function removeAdFromStorage(ad_id) {
    localStorage.removeItem(`ad_${ad_id}`);
    console.log(`Ad ${ad_id} has been removed from localStorage.`);
}

// removeAdFromStorage(1);

// Function to check if all ads have been viewed
function checkAllAdsViewed() {
    const adsContainer = document.getElementById('adsContainer');
    if (adsContainer.childElementCount === 0) {
        document.getElementById('root').style.display = 'flex';
    }
}

  // Example ads array
  const ads = [
      { ad_id: 'CryptoLS', ad_time: 7000, ad_name: 'Subscribe My Channel', img_url: 'https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png', ad_url: 'https://youtube.com/@cryptols' },
      { ad_id: 'TG-CryptoLS', ad_time: 5000, ad_name: 'Jion My Channel ', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dbOUeCrOBe-mkfGD-fEjQNECJrkromWTYg&s', ad_url: 'https://t.me/CryptoLSC' },

     { ad_id: 'zoo', ad_time: 10000, ad_name: 'Zoo', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4PObweTnbwKuklR3jyxJ6CG1R55rhTJUuyQ&s', ad_url: 'http://t.me/zoo_story_bot/game?startapp=ref1576630572' },
      { ad_id: 'do-not-h-bot', ad_time: 30000, ad_name: 'donot', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReX4Ni86I6m-9ibz6-FTokxKKVq1vai5V0ft3sN3ksP1dWRYuz0lsZ1zWv&s=10', ad_url: 'https://t.me/donot/game?startapp=1576630572' },
      { ad_id: 'babydoge', ad_time: 2000, ad_name: 'BabyDoge PAWS ', img_url: 'https://assets.coingecko.com/coins/images/16125/large/babydoge.jpg?1696515731', ad_url: 'https://t.me/BabyDogePAWS_Bot?start=r_1576630572' },
    { ad_id: 'PAWSOG_bot', ad_time: 10000, ad_name: 'PAWSOG_bot', img_url: 'https://img.cryptorank.io/coins/paws1730205532073.png', ad_url: 'https://t.me/PAWSOG_bot/PAWS?startapp=NheWxExw' },
     { ad_id: 'hi-pin', ad_time: 2000, ad_name: 'Hi Pin , like vana airdrop ', img_url: 'https://bits.apps-tonbox.me/images/airdrop-logo.png', ad_url: 'https://t.me/hi_PIN_bot/app?startapp=p8iERCV' },
      { ad_id: 'bums', ad_time: 2000, ad_name: 'Bums (big airdrop)', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfzWfyLe7n2xj-uJGr1Sk_J-9Zdo2LqjNc5KsVk4p90ekAxzBJxHTLa9g&s=10', ad_url: 'https://t.me/bums/app?startapp=ref_ZUqucTwt' },
     { ad_id: 'FERRET', ad_time: 2000, ad_name: 'FERRET new airdrop bot', img_url: 'https://ferret-three.vercel.app/page/icon/logo.png', ad_url: 'https://t.me/ferret_official_bot/FERRET?startapp=1576630572' },
      { ad_id: 'Midas-Yielder-app', ad_time: 2000, ad_name: 'Midas Yielder app', img_url: 'https://pbs.twimg.com/profile_images/1831765328314933248/LObrXaFC_400x400.jpg', ad_url: 'https://t.me/MidasRWA_bot/app?startapp=ref_7d601062-61bd-45fc-aaee-facc99f8a8b5' },
 ];
 
  // Display the ads
  displayAds(ads);

