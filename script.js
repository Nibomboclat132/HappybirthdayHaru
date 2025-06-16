document.addEventListener("DOMContentLoaded", () => {
  // Gallery images for the second slide - 22 images from img1.jpg to img22.jpg
  const galleryImages = [];
  for (let i = 1; i <= 21; i++) {
    galleryImages.push(`img${i}.jpg`);
  }

  // Slideshow data - you can add more slides or customize these
  const slidesData = [
    {
      image: "https://via.placeholder.com/600x400/ffebf3/333?text=NewJeans+1",
      title: "NEWJEANS 💝",
      text: "Text",
    },
    {
      type: "gallery",
      title: "PHOTO GALLERY 📸",
      text: "Browse through 22 special pictures!",
    },
    {
      image: "https://via.placeholder.com/600x400/ffebf3/333?text=Birthday+Wish",
      title: "BIRTHDAY WISH 🎂",
      text: "gsss",
    },
    {
      image: "https://via.placeholder.com/600x400/ffebf3/333?text=K-pop+Love",
      title: "K-POP LOVE 💖",
      text: 'fat',
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
      title: "ILLIT - Lovey Dovey",
      src: "music/lovey-dovey.mp3",
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

  // Gallery button references (will be set after gallery is created)
  let galleryPrevBtn = null
  let galleryNextBtn = null
  let galleryMainImage = null
  let galleryCurrentImage = null
  let galleryThumbnails = null

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
      console.log("Error playing click sound:", error)
    })

    clickSoundClone.onended = () => {
      clickSoundClone.remove()
    }
  }

  // Add click sound to all buttons
  function addClickSoundToButtons() {
    // Use event delegation for dynamically created buttons
    document.addEventListener('click', (e) => {
      if (e.target.matches('.pixel-button, .window-button, .page-dot, .scrollbar-up, .scrollbar-down, .gallery-btn, .gallery-thumb')) {
        playClickSound()
      }
    })
  }

  // Initialize music player
  function initMusicPlayer() {
    audioPlayer.src = songsData[currentSong].src
    songTitle.textContent = songsData[currentSong].title

    checkTitleLength()

    playPauseBtn.addEventListener("click", togglePlayPause)
    prevSongBtn.addEventListener("click", playPreviousSong)
    nextSongBtn.addEventListener("click", playNextSong)

    audioPlayer.addEventListener("ended", playNextSong)

    audioPlayer.addEventListener("error", () => {
      console.log("Error loading audio file. Using placeholder functionality.")
      updateSongTitle()
    })

    addButtonPressAnimation(playPauseBtn)
    addButtonPressAnimation(prevSongBtn)
    addButtonPressAnimation(nextSongBtn)
    addButtonPressAnimation(prevBtn)
    addButtonPressAnimation(nextBtn)
    addButtonPressAnimation(startButton)

    if (autoplayEnabled) {
      setTimeout(attemptAutoplay, 1000)
    }
  }

  // Attempt to autoplay music
  function attemptAutoplay() {
    if (!isPlaying && autoplayEnabled) {
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
      }, 500)
    }, 3000)
  }

  // Add button press animation
  function addButtonPressAnimation(button) {
    if (!button) return
    
    button.addEventListener("mousedown", () => {
      button.classList.add("active")
    })

    button.addEventListener("mouseup", () => {
      button.classList.remove("active")
    })

    button.addEventListener("mouseleave", () => {
      button.classList.remove("active")
    })

    button.addEventListener("touchstart", () => {
      button.classList.add("active")
    })

    button.addEventListener("touchend", () => {
      button.classList.remove("active")
    })
  }

  // Check if title needs scrolling
  function checkTitleLength() {
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

  // Play previous song
  function playPreviousSong() {
    currentSong = (currentSong - 1 + songsData.length) % songsData.length
    changeSong()
  }

  // Play next song
  function playNextSong() {
    currentSong = (currentSong + 1) % songsData.length
    changeSong()
  }

  // Change song
  function changeSong() {
    audioPlayer.src = songsData[currentSong].src
    updateSongTitle()

    if (isPlaying) {
      audioPlayer.play().catch((error) => {
        console.log("Error playing audio:", error)
      })
      equalizer.classList.add("active")
    }

    songTitle.classList.remove("pixel-animation")
    void songTitle.offsetWidth
    songTitle.classList.add("pixel-animation")

    checkTitleLength()
  }

  // Update song title
  function updateSongTitle() {
    songTitle.textContent = songsData[currentSong].title
  }

  // Gallery navigation functions
  function galleryPrevImage() {
    console.log("Gallery Previous clicked - Current:", currentGalleryImage)
    currentGalleryImage = (currentGalleryImage - 1 + galleryImages.length) % galleryImages.length
    console.log("Gallery Previous - New:", currentGalleryImage)
    updateGalleryImage()
  }

  function galleryNextImage() {
    console.log("Gallery Next clicked - Current:", currentGalleryImage)
    currentGalleryImage = (currentGalleryImage + 1) % galleryImages.length
    console.log("Gallery Next - New:", currentGalleryImage)
    updateGalleryImage()
  }

  function galleryGoToImage(index) {
    console.log("Gallery Go To Image:", index)
    currentGalleryImage = parseInt(index)
    updateGalleryImage()
  }

  // Create gallery slide
  function createGallerySlide() {
    return `
      <div class="gallery-container">
        <div class="gallery-main">
          <img src="${galleryImages[0]}" alt="Gallery Image 1" class="gallery-image" id="galleryMainImage">
        </div>
        <div class="gallery-controls">
          <button class="gallery-btn" id="galleryPrevBtn" type="button">←</button>
          <div class="gallery-counter">
            <span id="galleryCurrentImage">1</span> / <span id="galleryTotalImages">${galleryImages.length}</span>
          </div>
          <button class="gallery-btn" id="galleryNextBtn" type="button">→</button>
        </div>
        <div class="gallery-thumbnails" id="galleryThumbnails">
          ${galleryImages.map((img, index) => 
            `<img src="${img}" alt="Thumbnail ${index + 1}" class="gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}" onerror="this.style.display='none'">`
          ).join('')}
        </div>
      </div>
    `;
  }

  // Create slides
  function createSlides() {
    slidesData.forEach((slide, index) => {
      const slideElement = document.createElement("div")
      slideElement.className = `slide ${index === 0 ? "active" : ""}`
      
      if (slide.type === "gallery") {
        slideElement.innerHTML = `
          <h2>${slide.title}</h2>
          <p>${slide.text}</p>
          ${createGallerySlide()}
        `;
      } else {
        slideElement.innerHTML = `
          <img src="${slide.image}" alt="${slide.title}" class="pixel-animation">
          <h2>${slide.title}</h2>
          <p>${slide.text}</p>
        `;
      }
      
      slideshowContainer.appendChild(slideElement)
    })

    // Initialize gallery functionality after slides are created
    setTimeout(initGallery, 100)
  }

  // Initialize gallery functionality
  function initGallery() {
    console.log("Initializing gallery...")
    
    // Get gallery elements
    galleryPrevBtn = document.getElementById("galleryPrevBtn")
    galleryNextBtn = document.getElementById("galleryNextBtn")
    galleryMainImage = document.getElementById("galleryMainImage")
    galleryCurrentImage = document.getElementById("galleryCurrentImage")
    galleryThumbnails = document.getElementById("galleryThumbnails")

    console.log("Gallery elements found:", {
      prevBtn: !!galleryPrevBtn,
      nextBtn: !!galleryNextBtn,
      mainImage: !!galleryMainImage,
      currentImage: !!galleryCurrentImage,
      thumbnails: !!galleryThumbnails
    })

    if (!galleryPrevBtn || !galleryNextBtn || !galleryMainImage) {
      console.error("Gallery elements not found!")
      return
    }

    // Add error handling for main image
    galleryMainImage.onerror = function() {
      console.log(`Error loading image: ${this.src}`)
      this.src = "https://via.placeholder.com/400x300/ffebf3/333?text=Image+Not+Found"
    }

    // Remove any existing event listeners and add new ones
    galleryPrevBtn.onclick = null
    galleryNextBtn.onclick = null
    
    galleryPrevBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Gallery Prev button clicked!")
      galleryPrevImage()
    })

    galleryNextBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Gallery Next button clicked!")
      galleryNextImage()
    })

    // Thumbnail clicks with event delegation
    if (galleryThumbnails) {
      galleryThumbnails.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.target.classList.contains("gallery-thumb")) {
          console.log("Thumbnail clicked:", e.target.dataset.index)
          galleryGoToImage(e.target.dataset.index)
        }
      })
    }

    // Add button animations
    addButtonPressAnimation(galleryPrevBtn)
    addButtonPressAnimation(galleryNextBtn)

    console.log("Gallery initialized successfully!")
  }

  // Update gallery image
  function updateGalleryImage() {
    console.log("Updating gallery image to:", currentGalleryImage, galleryImages[currentGalleryImage])
    
    if (galleryMainImage) {
      galleryMainImage.src = galleryImages[currentGalleryImage]
      galleryMainImage.classList.remove("pixel-animation")
      void galleryMainImage.offsetWidth
      galleryMainImage.classList.add("pixel-animation")
    }

    if (galleryCurrentImage) {
      galleryCurrentImage.textContent = currentGalleryImage + 1
    }

    // Update thumbnail active state
    const thumbnails = document.querySelectorAll(".gallery-thumb")
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle("active", index === currentGalleryImage)
    })

    // Scroll thumbnails to show active one
    const activeThumbnail = document.querySelector('.gallery-thumb.active')
    if (activeThumbnail) {
      activeThumbnail.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest', 
        inline: 'center' 
      })
    }
  }

  // Create page indicators
  function createPageIndicators() {
    slidesData.forEach((_, index) => {
      const dot = document.createElement("div")
      dot.className = `page-dot ${index === 0 ? "active" : ""}`
      dot.addEventListener("click", () => {
        showSlide(index)
        updateScrollbarThumb(index)
      })
      pageIndicators.appendChild(dot)
    })

    totalPagesSpan.textContent = slidesData.length
  }

  // Show slide
  function showSlide(index) {
    const slides = document.querySelectorAll(".slide")
    const dots = document.querySelectorAll(".page-dot")

    if (index >= slides.length) {
      currentSlide = 0
    } else if (index < 0) {
      currentSlide = slides.length - 1
    } else {
      currentSlide = index
    }

    slides.forEach((slide, i) => {
      slide.classList.remove("active")
      if (i === currentSlide) {
        slide.classList.add("active")
        const img = slide.querySelector("img:not(.gallery-thumb)")
        if (img && !img.classList.contains("gallery-image")) {
          img.classList.remove("pixel-animation")
          void img.offsetWidth
          img.classList.add("pixel-animation")
        }
      }
    })

    dots.forEach((dot, i) => {
      dot.classList.remove("active")
      if (i === currentSlide) {
        dot.classList.add("active")
      }
    })

    currentPageSpan.textContent = currentSlide + 1
    updateScrollbarThumb(currentSlide)

    // Re-initialize gallery if we're on the gallery slide
    if (currentSlide === 1) {
      setTimeout(initGallery, 100)
    }
  }

  // Update scrollbar thumb position
  function updateScrollbarThumb(index) {
    const totalSlides = slidesData.length
    const trackHeight = document.querySelector(".scrollbar-track").clientHeight - scrollbarThumb.clientHeight
    const newPosition = (index / (totalSlides - 1)) * trackHeight
    scrollbarThumb.style.top = `${newPosition}px`
  }

  // Next slide
  function nextSlide() {
    showSlide(currentSlide + 1)
  }

  // Previous slide
  function prevSlide() {
    showSlide(currentSlide - 1)
  }

  // Initialize scrollbar
  function initScrollbar() {
    scrollbarUp.addEventListener("click", () => {
      prevSlide()
    })

    scrollbarDown.addEventListener("click", () => {
      nextSlide()
    })

    let isDragging = false
    let startY = 0
    let startTop = 0

    scrollbarThumb.addEventListener("mousedown", (e) => {
      isDragging = true
      startY = e.clientY
      startTop = Number.parseInt(getComputedStyle(scrollbarThumb).top, 10)
      document.body.style.userSelect = "none"
    })

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return

      const trackHeight = document.querySelector(".scrollbar-track").clientHeight - scrollbarThumb.clientHeight
      const deltaY = e.clientY - startY
      let newTop = startTop + deltaY

      newTop = Math.max(0, Math.min(newTop, trackHeight))
      scrollbarThumb.style.top = `${newTop}px`

      const slideIndex = Math.round((newTop / trackHeight) * (slidesData.length - 1))
      showSlide(slideIndex)
    })

    document.addEventListener("mouseup", () => {
      isDragging = false
      document.body.style.userSelect = ""
    })

    updateScrollbarThumb(0)
  }

  // Initialize window controls
  function initWindowControls() {
    windowButtons[0].addEventListener("click", () => {
      console.log("Minimize clicked")
    })

    windowButtons[1].addEventListener("click", () => {
      console.log("Maximize clicked")
    })

    windowButtons[2].addEventListener("click", () => {
      console.log("Close clicked")
    })
  }

  // Initialize slideshow
  createSlides()
  createPageIndicators()
  initScrollbar()
  initWindowControls()

  // Initialize music player
  initMusicPlayer()

  // Add click sound to all buttons
  addClickSoundToButtons()

  // Event listeners
  nextBtn.addEventListener("click", () => {
    hasUserInteracted = true
    nextSlide()
  })

  prevBtn.addEventListener("click", () => {
    hasUserInteracted = true
    prevSlide()
  })

  // Track user interaction for autoplay
  document.addEventListener("click", () => {
    if (!hasUserInteracted) {
      hasUserInteracted = true
      if (autoplayEnabled && !isPlaying) {
        setTimeout(attemptAutoplay, 500)
      }
    }
  })

  // Show birthday popup after 2 seconds
  setTimeout(() => {
    birthdayPopup.classList.add("show")
  }, 2000)

  // Close popup
  closePopupBtn.addEventListener("click", () => {
    birthdayPopup.classList.remove("show")
  })

  // Start button
  startButton.addEventListener("click", () => {
    birthdayPopup.classList.remove("show")
    createConfetti()
  })

  // Confetti effect
  function createConfetti() {
    const colors = ["#ff6b9e", "#ff9ec6", "#ffd6e7", "#a8e6cf", "#dcedc1"]

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement("div")
      confetti.style.position = "fixed"
      confetti.style.width = "10px"
      confetti.style.height = "10px"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.top = "-10px"
      confetti.style.borderRadius = "50%"
      confetti.style.zIndex = "1000"
      confetti.style.transform = "rotate(0deg)"
      document.body.appendChild(confetti)

      const animation = confetti.animate(
        [
          { top: "-10px", transform: "rotate(0deg)" },
          { top: `${Math.random() * 100 + 50}vh`, transform: "rotate(360deg)" },
        ],
        {
          duration: Math.random() * 3000 + 2000,
          easing: "cubic-bezier(0.1, 0.8, 0.3, 1)",
        },
      )

      animation.onfinish = () => {
        confetti.remove()
      }
    }
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    console.log("Key pressed:", e.key, "Current slide:", currentSlide)
    
    if (currentSlide === 1) { // Gallery slide
      if (e.key === "ArrowRight") {
        e.preventDefault()
        console.log("Arrow right on gallery slide")
        galleryNextImage()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        console.log("Arrow left on gallery slide")
        galleryPrevImage()
      }
    } else {
      // Regular slide navigation
      if (e.key === "ArrowRight") {
        nextSlide()
      } else if (e.key === "ArrowLeft") {
        prevSlide()
      }
    }
    
    if (e.key === " ") {
      togglePlayPause()
      e.preventDefault()
    }
  })
})