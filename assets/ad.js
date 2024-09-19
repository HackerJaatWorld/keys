

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
   // { ad_id: 'v15', ad_time: 60000, ad_name: 'Hamster Kombat cheating is bad card removed | Hamster Kombat Achievement card remove Hamster Airdrop(watch 1m)', img_url: 'https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png', ad_url: 'https://youtu.be/G1pMKB5nBrE' },
   //  { ad_id: 'v16', ad_time: 60000, ad_name: 'Hamster Kombat 80% Airdrops achievement | Hamster new update 80% Airdrops for cheating is a bad(very important )', img_url: 'https://static.vecteezy.com/system/resources/thumbnails/023/986/480/small_2x/youtube-logo-youtube-logo-transparent-youtube-icon-transparent-free-free-png.png', ad_url: 'https://youtube.com/shorts/xTD5GpccB8I?feature=share' },
    //   { ad_id: '36', ad_time: 10000, ad_name: 'Open , Complete all task , connect walletwallet, withdrawal 50USDT', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHfEle2N2FPFjR8t4H7Zrt5aPfVox77VICfCQ4M2T3q1TyYX3hgWh13Yw&s=10', ad_url: 'http://t.me/OficialCPTOBOT/PTO?start=h7YG5MADHZVhZ1NbzOpL' },
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
//     //    //  { ad_id: '27', ad_time: 30000, ad_name: 'Spinsters', img_url: 'https://img.freepik.com/free-vector/spin-fortune-wheel-luck-background_1017-31403.jpg', ad_url: 'https://t.me/Spinstersbot/luckywheel?startapp=NTgwNjc3MTY3Ng' },
//     //  { ad_id: '28', ad_time: 30000, ad_name: 'LuckBot', img_url: 'https://img.freepik.com/free-vector/lottery-luck-wheel-fortune-design_1017-25642.jpg', ad_url: 'https://t.me/LuckyCode666_bot/LuckyCoin?startapp=0ChQI2OTL3wsSDAiu-cu2BhD6pOaWAQ' },
//     { ad_id: 'memecoin', ad_time: 30000, ad_name: 'MemeCoin', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP7I5Ui16gNtqPzjoxCTIhzjwTWMRPy8SWpA&usqp=CAU', ad_url: 'https://t.me/iMemeCatsBot/app?startapp=ref_PAxwja' },
//        { ad_id: 't-m', ad_time: 30000, ad_name: 'Time farm(listing soon)', img_url: 'https://img-tap-miniapp.chrono.tech/images/wallet/coin-2x.png', ad_url: 'https://t.me/TimeFarmCryptoBot?start=12KbWT3tifYa8Ana0' },
//     { ad_id: '30', ad_time: 30000, ad_name: 'Agent (listing in September)', img_url: 'https://usethebitcoin.com/wp-content/uploads/2024/08/Agent-301.png.webp', ad_url: 'https://t.me/Agent301Bot/app?startapp=onetime1576630572' },
//     { ad_id: '32', ad_time: 10000, ad_name: 'BabyDoge PAWS ', img_url: 'https://assets.coingecko.com/coins/images/16125/large/babydoge.jpg?1696515731', ad_url: 'https://t.me/BabyDogePAWS_Bot?start=r_1576630572' },
//     { ad_id: '33', ad_time: 10000, ad_name: 'Catize (listing: 20)', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlPYcy1_q1YtfPLP4xd3HPZ5ZiPqNT6khdBA&s', ad_url: 'https://t.me/catizenbot/gameapp?startapp=r_1312_25214230' },
//     { ad_id: 'binance-bot', ad_time: 10000, ad_name: 'Binance Moonbix bot (Binance) ', img_url: 'https://miro.medium.com/v2/resize:fit:640/1*8QOXUkuofZr0kS-4UbPwzw.jpeg', ad_url: 'https://t.me/Binance_Moonbix_bot/start?startApp=ref_1576630572&startapp=ref_1576630572&utm_medium=web_share_copy' },
//     { ad_id: '35', ad_time: 10000, ad_name: 'Rocky Rabbit (23 Sept)', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpp2MaOXdcg5NxXo3lH2OGyFKV42hp9JwSRA&s', ad_url: 'https://t.me/rocky_rabbit_bot/play?startapp=frId1576630572' },
//     { ad_id: '37', ad_time: 10000, ad_name: 'TapCoin (11 Sept)', img_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWwUYxmKJy7GxXlA-kg1hn4vEgaI3E12SvV2mQ5dAXs65Amr0SKSJSCrw&s=10', ad_url: 'https://t.me/tapcoinsbot/app?startapp=ref_mwpmZw' },
//     { ad_id: '38', ad_time: 2000, ad_name: 'Rats Kingdom', img_url: 'https://tg.ratskingdom.com/assets/logo.png', ad_url: 'http://t.me/RatsKingdom_Bot/join?startapp=66dc4fba11bc635a36094578' },
//      { ad_id: '41', ad_time: 2000, ad_name: 'battle bulls(Today listing  )', img_url: 'https://tg.battle-games.com/static/media/bull-coin.e182b111731e0bfaf937.png', ad_url: 'https://t.me/battle_games_com_bot/start?startapp=frndId1576630572' },
//     { ad_id: '39', ad_time: 2000, ad_name: 'LovelyLegends Bot (already listed)', img_url: 'https://lovely.finance/_next/image?url=%2Fimg%2Flovely-legends-coin.png&w=1080&q=75', ad_url: 'https://t.me/LovelyLegends_bot/start?startapp=kentId1576630572' },
//     { ad_id: '40', ad_time: 2000, ad_name: 'Gamee (23 Sep)', img_url: 'https://prizes.gamee.com/_next/static/media/wat-miner.e4e4f3d9.png', ad_url: 'https://t.me/gamee/start?startapp=ref_1576630572' },
  ];

  // Display the ads
  displayAds(ads);

