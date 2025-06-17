document.addEventListener("DOMContentLoaded", () => {
  // Gallery images for the second slide - 22 images from img1.jpg to img22.jpg
  const galleryImages = []
  for (let i = 1; i <= 21; i++) {
    galleryImages.push(`img${i}.jpg`)
  }

  // Slideshow data - you can add more slides or customize these
  const slidesData = [
    {
      image: "NJS.jpg",
      title: "Haru",
      text: "Small pixel art I made for you",
      // text:"⸜(｡˃ ᵕ ˂ )⸝♡", // This line was duplicated, I'll keep the second one.
      text: "⸜(｡˃ ᵕ ˂ )⸝♡",
    },
    {
      type: "gallery",
      title: "PHOTO GALLERY   •ᴗ•  ", // Corrected count
    },
    {
      title: "BIRTHDAY WISH ",
      text: "I wish you the happiest birthday and ◝(ᵔᗜᵔ)◜. Hope youll have a great day not for now for always. I hope youll take care of yourself ",
    },
    {
      image: "Cute.gif",
      title: "Stay Safe",
    },
  ]

  // Music player data
  const songsData = [
    {
      title: "ILLIT - Magnetic",
      src: "Magnetic.mp3",
    },
    {
      title: "Cherish My Love",
      src: "Cherish My Love.mp3",
    },
    {
      title: "ILLIT-TickTack",
      src: "TickTack.mp3",
    },
    {
      title: "Cookie",
      src: "Cookie.mp3",
    },
    {
      title: "Hype Boy",
      src: "Hype Boy.mp3",
    },
  ]

  const slideshowContainer = document.querySelector(".slideshow-container")
  const prevBtn = document.getElementById("prev-btn")
  const nextBtn = document.getElementById("next-btn")
  const birthdayPopup = document.getElementById("birthdayPopup")
  const closePopupBtn = document.getElementById("closePopup")
  const startButton = document.getElementById("startButton")
  const pageIndicators = document.getElementById("pageIndicators")
  const currentPageSpan = document.getElementById("currentPage")
  const totalPagesSpan = document.getElementById("totalPages")
  const scrollbarThumb = document.querySelector(".scrollbar-thumb")
  const scrollbarUp = document.querySelector(".scrollbar-up")
  const scrollbarDown = document.querySelector(".scrollbar-down")
  const windowButtons = document.querySelectorAll(".window-button")

  // Music player elements
  const playPauseBtn = document.getElementById("playPauseBtn")
  const prevSongBtn = document.getElementById("prevSongBtn")
  const nextSongBtn = document.getElementById("nextSongBtn")
  const songTitle = document.getElementById("songTitle")
  const equalizer = document.getElementById("equalizer")

  // Click sound element
  const clickSound = document.getElementById("clickSound")

  let currentSlide = 0
  let currentSong = 0
  let currentGalleryImage = 0
  let isPlaying = false
  let lastClickTime = 0
  const autoplayEnabled = true
  let hasUserInteracted = false
  let galleryAutoplayInterval = null

  // Gallery button references (will be set after gallery is created)
  let galleryMainImage = null
  let galleryCurrentImageCounter = null

  // Create audio element for music
  const audioPlayer = new Audio()
  audioPlayer.volume = 0.7

  // Function to play click sound
  function playClickSound() {
    const now = Date.now()
    if (now - lastClickTime < 50) return
    lastClickTime = now

    const clickSoundClone = clickSound.cloneNode(true)
    clickSoundClone.volume = 0.3

    clickSoundClone.play().catch((error) => {
      // console.log("Error playing click sound:", error) // Optional: reduce console noise
    })

    clickSoundClone.onended = () => {
      clickSoundClone.remove()
    }
  }

  // Add click sound to all buttons
  function addClickSoundToButtons() {
    document.addEventListener("click", (e) => {
      if (e.target.matches(".pixel-button, .window-button, .page-dot, .scrollbar-up, .scrollbar-down")) {
        playClickSound()
      }
    })
  }

  // Initialize music player
  function initMusicPlayer() {
    audioPlayer.src = songsData[currentSong].src
    songTitle.textContent = songsData[currentSong].title

    checkTitleLengthAndAnimate() // Combined function

    playPauseBtn.addEventListener("click", togglePlayPause)
    prevSongBtn.addEventListener("click", playPreviousSong)
    nextSongBtn.addEventListener("click", playNextSong)

    audioPlayer.addEventListener("ended", playNextSong)

    audioPlayer.addEventListener("error", () => {
      console.log("Error loading audio file. Using placeholder functionality.")
      updateSongTitle()
    })

    // Add button press animations
    const buttonsToAnimate = [
      playPauseBtn,
      prevSongBtn,
      nextSongBtn,
      prevBtn,
      nextBtn,
      startButton,
      closePopupBtn, // Added close popup button for animation
    ]
    buttonsToAnimate.forEach(addButtonPressAnimation)

    if (autoplayEnabled) {
      setTimeout(attemptAutoplay, 1000)
    }
  }

  // Attempt to autoplay music
  function attemptAutoplay() {
    if (!isPlaying && autoplayEnabled && !hasUserInteracted) {
      // Check hasUserInteracted here too
      audioPlayer
        .play()
        .then(() => {
          isPlaying = true
          playPauseBtn.textContent = "⏸️"
          equalizer.classList.add("active")
          console.log("Autoplay started successfully")
          showAutoplayNotification("🎵 Music started automatically!")
        })
        .catch((error) => {
          console.log("Autoplay blocked by browser:", error)
          showAutoplayNotification("🔇 Click play to start music (autoplay blocked)")
        })
    }
  }

  // Show autoplay notification
  function showAutoplayNotification(message) {
    const notification = document.createElement("div")
    notification.className = "autoplay-notification"
    notification.textContent = message
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.classList.add("show")
    }, 100)

    setTimeout(() => {
      notification.classList.remove("show")
      setTimeout(() => {
        notification.remove()
      }, 500) // Match CSS transition
    }, 3000)
  }

  // Add button press animation
  function addButtonPressAnimation(button) {
    if (!button) return

    button.addEventListener("mousedown", () => button.classList.add("active"))
    button.addEventListener("mouseup", () => button.classList.remove("active"))
    button.addEventListener("mouseleave", () => button.classList.remove("active"))
    button.addEventListener("touchstart", () => button.classList.add("active"), { passive: true })
    button.addEventListener("touchend", () => button.classList.remove("active"))
  }

  // Check if title needs scrolling and apply/remove class
  function checkTitleLengthAndAnimate() {
    // Ensure songTitle and its parent are available
    if (!songTitle || !songTitle.parentElement) {
      // console.warn("Song title or parent not found for scrolling check.");
      return
    }
    // Force a reflow to get the correct scrollWidth, especially after text content changes.
    songTitle.style.display = "none"
    songTitle.style.display = ""

    const titleWidth = songTitle.scrollWidth
    const containerWidth = songTitle.parentElement.clientWidth

    if (titleWidth > containerWidth) {
      songTitle.classList.add("scrolling")
    } else {
      songTitle.classList.remove("scrolling")
    }
  }

  // Toggle play/pause
  function togglePlayPause() {
    hasUserInteracted = true // User interaction
    if (isPlaying) {
      audioPlayer.pause()
      playPauseBtn.textContent = "▶️"
      equalizer.classList.remove("active")
    } else {
      audioPlayer.play().catch((error) => {
        console.log("Error playing audio:", error)
      })
      playPauseBtn.textContent = "⏸️"
      equalizer.classList.add("active")
    }
    isPlaying = !isPlaying
  }

  function playPreviousSong() {
    hasUserInteracted = true
    currentSong = (currentSong - 1 + songsData.length) % songsData.length
    changeSong()
  }

  function playNextSong() {
    hasUserInteracted = true
    currentSong = (currentSong + 1) % songsData.length
    changeSong()
  }

  function changeSong() {
    audioPlayer.src = songsData[currentSong].src
    updateSongTitle()

    if (isPlaying) {
      audioPlayer.play().catch((error) => {
        console.log("Error playing audio:", error)
      })
      equalizer.classList.add("active")
    }

    checkTitleLengthAndAnimate()
  }

  function updateSongTitle() {
    songTitle.textContent = songsData[currentSong].title
  }

  function galleryNextImage() {
    currentGalleryImage = (currentGalleryImage + 1) % galleryImages.length
    updateGalleryImage()
  }

  function startGalleryAutoplay() {
    if (galleryAutoplayInterval) {
      clearInterval(galleryAutoplayInterval)
    }
    galleryAutoplayInterval = setInterval(() => {
      galleryNextImage()
    }, 3000) // Change image every 3 seconds
  }

  function stopGalleryAutoplay() {
    if (galleryAutoplayInterval) {
      clearInterval(galleryAutoplayInterval)
      galleryAutoplayInterval = null
    }
  }

  function createGallerySlide() {
    return `
      <div class="gallery-container">
        <div class="gallery-main">
          <img src="${galleryImages[currentGalleryImage]}" alt="Gallery Image ${currentGalleryImage + 1}" class="gallery-image" id="galleryMainImage">
        </div>
        <div class="gallery-counter">
          <span id="galleryCurrentImageCounter">1</span> / <span id="galleryTotalImages">${galleryImages.length}</span>
        </div>
      </div>
    `
  }

  function createSlides() {
    slidesData.forEach((slide, index) => {
      const slideElement = document.createElement("div")
      slideElement.className = `slide ${index === 0 ? "active" : ""}`

      if (slide.type === "gallery") {
        slideElement.innerHTML = `
          <h2>${slide.title}</h2>
          <p>${slide.text}</p>
          ${createGallerySlide()}
        `
      } else {
        slideElement.innerHTML = `
          <img src="${slide.image}" alt="${slide.title}" class="pixel-animation" onerror="this.src='https://via.placeholder.com/300x200/ffebf3/333?text=Image+Not+Found'; this.alt='Image Error'">
          <h2>${slide.title}</h2>
          <p>${slide.text}</p>
        `
      }
      slideshowContainer.appendChild(slideElement)
    })
    setTimeout(initGallery, 0) // Defer gallery initialization slightly
  }

  function initGallery() {
    galleryMainImage = document.getElementById("galleryMainImage")
    galleryCurrentImageCounter = document.getElementById("galleryCurrentImageCounter")

    if (!galleryMainImage || !galleryCurrentImageCounter) {
      return // Exit if elements aren't there (e.g., gallery slide not shown yet)
    }

    galleryMainImage.onerror = function () {
      console.log(`Error loading main gallery image: ${this.src}`)
      this.src = "https://via.placeholder.com/400x300/ffebf3/333?text=Image+Not+Found" // Fallback
    }

    updateGalleryImage() // Initialize with the first image details
  }

  function updateGalleryImage() {
    if (!galleryMainImage || !galleryCurrentImageCounter) {
      return
    }
    galleryMainImage.src = galleryImages[currentGalleryImage]
    galleryMainImage.alt = `Gallery Image ${currentGalleryImage + 1}`

    galleryCurrentImageCounter.textContent = currentGalleryImage + 1
  }

  function createPageIndicators() {
    slidesData.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.className = `page-dot ${index === 0 ? "active" : ""}`
      dot.addEventListener("click", () => {
        hasUserInteracted = true
        showSlide(index)
      })
      pageIndicators.appendChild(dot)
    })
    totalPagesSpan.textContent = slidesData.length
  }

  function showSlide(index) {
    const slides = slideshowContainer.querySelectorAll(".slide")
    const dots = pageIndicators.querySelectorAll(".page-dot")

    currentSlide = (index + slides.length) % slides.length

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === currentSlide)
      if (i === currentSlide) {
        const img = slide.querySelector("img:not(.gallery-image)")
        if (img) {
          img.classList.remove("pixel-animation")
          void img.offsetWidth
          img.classList.add("pixel-animation")
        }
      }
    })

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentSlide)
    })

    currentPageSpan.textContent = currentSlide + 1

    if (slidesData[currentSlide].type === "gallery") {
      // Re-initialize or ensure gallery is ready if it wasn't before
      if (!galleryMainImage) {
        initGallery()
      } else {
        updateGalleryImage()
      }
      startGalleryAutoplay() // Start autoplay when gallery slide is active
    } else {
      stopGalleryAutoplay() // Stop autoplay when not on gallery slide
    }
  }

  function nextSlide() {
    showSlide(currentSlide + 1)
  }

  function prevSlide() {
    showSlide(currentSlide - 1)
  }

  // Initialize scrollbar
  function initScrollbar() {
    if (!scrollbarUp || !scrollbarDown || !scrollbarThumb) return

    scrollbarUp.addEventListener("click", () => {
      hasUserInteracted = true
      prevSlide()
    })
    scrollbarDown.addEventListener("click", () => {
      hasUserInteracted = true
      nextSlide()
    })
  }

  function initWindowControls() {
    windowButtons.forEach((button, index) => {
      button.addEventListener("click", () => {
        const actions = ["Minimize", "Maximize", "Close"]
        console.log(`${actions[index]} clicked (decorative)`)
      })
    })
  }

  // Initialize
  createSlides()
  createPageIndicators()
  initScrollbar()
  initWindowControls()
  initMusicPlayer()
  addClickSoundToButtons()

  nextBtn.addEventListener("click", () => {
    hasUserInteracted = true
    nextSlide()
  })
  prevBtn.addEventListener("click", () => {
    hasUserInteracted = true
    prevSlide()
  })

  document.addEventListener(
    "click",
    () => {
      if (!hasUserInteracted) {
        hasUserInteracted = true
        if (autoplayEnabled && !isPlaying) {
          attemptAutoplay()
        }
      }
    },
    { once: true },
  )

  setTimeout(() => {
    if (birthdayPopup) birthdayPopup.classList.add("show")
  }, 2000)

  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", () => {
      if (birthdayPopup) birthdayPopup.classList.remove("show")
      hasUserInteracted = true
      if (autoplayEnabled && !isPlaying) attemptAutoplay()
    })
  }

  if (startButton) {
    startButton.addEventListener("click", () => {
      if (birthdayPopup) birthdayPopup.classList.remove("show")
      createConfetti()
      hasUserInteracted = true
      if (autoplayEnabled && !isPlaying) attemptAutoplay()
    })
  }

  function createConfetti() {
    const colors = ["#ff6b9e", "#ff9ec6", "#ffd6e7", "#a8e6cf", "#dcedc1"]
    const confettiContainer = document.body

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div")
      confetti.style.position = "fixed"
      confetti.style.width = `${Math.random() * 8 + 6}px`
      confetti.style.height = confetti.style.width
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.top = `-${Math.random() * 20 + 10}px`
      confetti.style.borderRadius = "50%"
      confetti.style.zIndex = "1000"
      confetti.style.opacity = `${Math.random() * 0.5 + 0.5}`

      confettiContainer.appendChild(confetti)

      const fallDuration = Math.random() * 3000 + 3000
      const fallDistance = window.innerHeight + 20

      confetti.animate(
        [
          { transform: `translateY(0px) rotate(0deg)`, opacity: 1 },
          { transform: `translateY(${fallDistance}px) rotate(${Math.random() * 720 - 360}deg)`, opacity: 0 },
        ],
        {
          duration: fallDuration,
          easing: "ease-out",
        },
      ).onfinish = () => {
        confetti.remove()
      }
    }
  }

  document.addEventListener("keydown", (e) => {
    // If popup is active, don't handle slideshow navigation
    if (birthdayPopup && birthdayPopup.classList.contains("show")) return

    hasUserInteracted = true

    if (e.key === "ArrowRight") {
      nextSlide()
      e.preventDefault()
    } else if (e.key === "ArrowLeft") {
      prevSlide()
      e.preventDefault()
    }

    if (e.key === " ") {
      // Spacebar for play/pause
      togglePlayPause()
      e.preventDefault()
    }
  })
})
