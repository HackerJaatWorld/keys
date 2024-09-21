

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
   { ad_id: 'v20', ad_time: 60000, ad_name: 'Hamster Season 1 Airdrops & Snapshot withdrawal Hamster Kombat Season 1 end biggest Airdrop', img_url: 'https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png', ad_url: 'https://youtu.be/74ODaeLIz5I?si=0W_frsbUiffBg-00' },
     { ad_id: 'v19', ad_time: 60000, ad_name: 'Hamster Kombat price prediction| Hamster Kombat $HMSTR Token sell or hold | Hamster Kombat value (watch 1m)', img_url: 'https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png', ad_url: 'https://youtu.be/WJrFcNeXzX0?si=HCcFcjiynlj1zyTU' },
      { ad_id: 'coub', ad_time: 2000, ad_name: 'Coub dogs hold ton hold and not hold and shorts video to earn', img_url: 'data:image/png;base64,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', ad_url: 'https://t.me/coub/app?startapp=coub__marker_18826843' },
    { ad_id: 'CryptoLS', ad_time: 7000, ad_name: 'Subscribe My Channel', img_url: 'https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png', ad_url: 'https://youtube.com/@cryptols' },
    { ad_id: '16', ad_time: 5000, ad_name: 'Jion My Channel ', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_dbOUeCrOBe-mkfGD-fEjQNECJrkromWTYg&s', ad_url: 'https://t.me/hamster_keys_tools' },
//     //   //    { ad_id: '23', ad_time: 10000, ad_name: 'Follow On Instagram', img_url: 'https://static.vecteezy.com/system/resources/previews/023/986/891/original/instagram-logo-instagram-logo-transparent-instagram-icon-transparent-free-free-png.png', ad_url: 'https://www.instagram.com/never_trust_in_females' },

//     { ad_id: '10', ad_time: 10000, ad_name: 'Winzy Lucky ', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPhyyTo-r7PYEX0Ra9xMF7x1B7Dv2jNsk2nw&s', ad_url: 'https://t.me/winzyluckybot/webapp?startapp=NzI2MjI2OTU4OCNXaW56eU9mZmljaWFsMg' },
//     //   //   { ad_id: 'yesh-13', ad_time: 10000, ad_name: 'Frogs House Bot', img_url: 'https://frogs.digital/logo.png', ad_url: 'https://t.me/Frogs_HouseBot?start=1576630572' },
//     { ad_id: 'parmila-14', ad_time: 10000, ad_name: 'X Empire', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvGrT9Cydt0zxopScCN6XCDKjJyix025oswg&s', ad_url: 'https://t.me/empirebot/game?startapp=hero1576630572' },
//     { ad_id: 'bhavshu-15', ad_time: 10000, ad_name: 'Cats Coin', img_url: 'https://miro.medium.com/v2/resize:fit:640/1*Xk2PdNVI6DDukb5vpi0lhw.jpeg', ad_url: 'https://t.me/catsgang_bot/join?startapp=gOhFclfE-RS9YxdEU7OgT' },
//     { ad_id: '19', ad_time: 10000, ad_name: 'Major (30 October)', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy9FQaQczxhvflUNSftUiYb-PiQQ8Ui3u2QQmYkuHzWY4RPzxf0XoxECG7EvTZWkJomkY&usqp=CAU', ad_url: 'https://t.me/major/start?startapp=1576630572' },
//     { ad_id: '20', ad_time: 10000, ad_name: 'Pandas bot', img_url: 'https://web.pandasonton.com/assets/pandac.png', ad_url: 'https://t.me/Pandas_HouseBot?start=1576630572' },
//     { ad_id: '21', ad_time: 10000, ad_name: 'Tomarket', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjE9BM0sI08drASDE9jYo3YerCam6GZoUCrw&s', ad_url: 'https://t.me/Tomarket_ai_bot/app?startapp=00008HRR' },
//     { ad_id: '22', ad_time: 10000, ad_name: 'Blum', img_url: 'https://img.bitgetimg.com/multiLang/web/6a914e6e4aa70f6fd2bdf790f0f8401f.png', ad_url: 'https://t.me/blum/app?startapp=ref_ybggfIg6UR' },
//     { ad_id: '24', ad_time: 30000, ad_name: 'BINANCE Red Packet Giveaway', img_url: 'https://public.bnbstatic.com/image/pgc/202401/92b30901ba1488d8f9569c2eee9bed4d.jpg', ad_url: 'https://s.binance.com/RGckHPIC' },
//     { ad_id: '25', ad_time: 30000, ad_name: 'Money Dogs', img_url: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQqMVzKphoLZeR2Pa_uNjvZivE1NEdpUfOy83q_7K-3Xbqw_sad', ad_url: 'https://t.me/money_dogs_bot/money_dogs?startapp=LnO3x7jW' },
//   //  { ad_id: '26', ad_time: 30000, ad_name: 'FindoLucky', img_url: 'https://play-lh.googleusercontent.com/K_clTLFwc5AUyxCOnT2FlenNJl_SSA4MNDmKeXl0v-EVnuoqt7H5mVA3MDkW0-dkTxM=w240-h480-rw', ad_url: 'https://t.me/findoluckybot/app?startapp=NjczMjkxMzA1N182NjY1ODcwNzAw' },
    { ad_id: 'spinjack', ad_time: 30000, ad_name: 'Spin Jack ', img_url: 'https://img.freepik.com/free-vector/spin-fortune-wheel-luck-background_1017-31403.jpg', ad_url: 'https://t.me/spinjackbot/app?startapp=MTU3NjYzMDU3Ml83MzA4MDE1NDQy' },
//     //  { ad_id: '28', ad_time: 30000, ad_name: 'LuckBot', img_url: 'https://img.freepik.com/free-vector/lottery-luck-wheel-fortune-design_1017-25642.jpg', ad_url: 'https://t.me/LuckyCode666_bot/LuckyCoin?startapp=0ChQI2OTL3wsSDAiu-cu2BhD6pOaWAQ' },
//     { ad_id: 'memecoin', ad_time: 30000, ad_name: 'MemeCoin', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP7I5Ui16gNtqPzjoxCTIhzjwTWMRPy8SWpA&usqp=CAU', ad_url: 'https://t.me/iMemeCatsBot/app?startapp=ref_PAxwja' },
//        { ad_id: 't-m', ad_time: 30000, ad_name: 'Time farm(listing soon)', img_url: 'https://img-tap-miniapp.chrono.tech/images/wallet/coin-2x.png', ad_url: 'https://t.me/TimeFarmCryptoBot?start=12KbWT3tifYa8Ana0' },
//     { ad_id: '30', ad_time: 30000, ad_name: 'Agent (listing in September)', img_url: 'https://usethebitcoin.com/wp-content/uploads/2024/08/Agent-301.png.webp', ad_url: 'https://t.me/Agent301Bot/app?startapp=onetime1576630572' },
//     { ad_id: '32', ad_time: 10000, ad_name: 'BabyDoge PAWS ', img_url: 'https://assets.coingecko.com/coins/images/16125/large/babydoge.jpg?1696515731', ad_url: 'https://t.me/BabyDogePAWS_Bot?start=r_1576630572' },
//     { ad_id: '33', ad_time: 10000, ad_name: 'Catize (listing: 20)', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlPYcy1_q1YtfPLP4xd3HPZ5ZiPqNT6khdBA&s', ad_url: 'https://t.me/catizenbot/gameapp?startapp=r_1312_25214230' },
     { ad_id: 'binance-bot', ad_time: 10000, ad_name: 'Binane Moonbix bot (Binance) ', img_url: 'https://miro.medium.com/v2/resize:fit:640/1*8QOXUkuofZr0kS-4UbPwzw.jpeg', ad_url: 'https://t.me/Binance_Moonbix_bot/start?startApp=ref_1576630572&startapp=ref_1576630572&utm_medium=web_share_copy' },
//     { ad_id: '35', ad_time: 10000, ad_name: 'Rocky Rabbit (23 Sept)', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpp2MaOXdcg5NxXo3lH2OGyFKV42hp9JwSRA&s', ad_url: 'https://t.me/rocky_rabbit_bot/play?startapp=frId1576630572' },
//     { ad_id: '37', ad_time: 10000, ad_name: 'TapCoin (11 Sept)', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWwUYxmKJy7GxXlA-kg1hn4vEgaI3E12SvV2mQ5dAXs65Amr0SKSJSCrw&s=10', ad_url: 'https://t.me/tapcoinsbot/app?startapp=ref_mwpmZw' },
   { ad_id: 'rats', ad_time: 2000, ad_name: 'Rats Kingdom', img_url: 'https://tg.ratskingdom.com/assets/logo.png', ad_url: 'http://t.me/RatsKingdom_Bot/join?startapp=66dc4fba11bc635a36094578' },
//      { ad_id: '41', ad_time: 2000, ad_name: 'battle bulls(Today listing  )', img_url: 'https://tg.battle-games.com/static/media/bull-coin.e182b111731e0bfaf937.png', ad_url: 'https://t.me/battle_games_com_bot/start?startapp=frndId1576630572' },
//     { ad_id: '39', ad_time: 2000, ad_name: 'LovelyLegends Bot (already listed)', img_url: 'https://lovely.finance/_next/image?url=%2Fimg%2Flovely-legends-coin.png&w=1080&q=75', ad_url: 'https://t.me/LovelyLegends_bot/start?startapp=kentId1576630572' },
//     { ad_id: '40', ad_time: 2000, ad_name: 'Gamee (23 Sep)', img_url: 'https://prizes.gamee.com/_next/static/media/wat-miner.e4e4f3d9.png', ad_url: 'https://t.me/gamee/start?startapp=ref_1576630572' },
  ];

  // Display the ads
  displayAds(ads);

