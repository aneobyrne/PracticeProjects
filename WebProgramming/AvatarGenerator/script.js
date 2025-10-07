const categories = {
  addOns: {
    images: [
      "images/blackcap.png",
      "images/blackhat.png",
      "images/flowerhat.jpg",
      "images/headphones.png"
    ],
    index: 0,
    element: document.getElementById("addOns"),
    nextBtn: "0nextBtn",
    prevBtn: "0prevBtn",
  },

  tops: {
    images: [
      "images/jersey.webp",
      "images/plainshirt.png",
      "images/suit.png",
      "images/sweater.jpg"
    ],
    index: 0,
    element: document.getElementById("tops"),
    nextBtn: "1nextBtn",
    prevBtn: "1prevBtn"
  },

  bottoms: {
    images: [
      "images/chandal.jpg",
      "images/jeans.jpg",
      "images/shorts.jpg",
      "images/skirt.webp"
    ],
    index: 0,
    element: document.getElementById("bottoms"),
    nextBtn: "2nextBtn",
    prevBtn: "2prevBtn"
  },
};

function updateImage(cat) {
  const category = categories[cat];
  category.element.src = category.images[category.index];
}

function setUpButtons() {
  for (const cat in categories) {
    const category = categories[cat];
    document.getElementById(category.nextBtn).addEventListener("click", () => {
      category.index = (category.index + 1) % category.images.length;
      updateImage(cat);
    });
    document.getElementById(category.prevBtn).addEventListener("click", () => {
      category.index = (category.index - 1 + category.images.length) % category.images.length;
      updateImage(cat);
    });
  }
}

function randomize() {
  for (const cat in categories) {
    const category = categories[cat];
    category.index = Math.floor(Math.random() * category.images.length);
    updateImage(cat);
  }
  //createConfetti();
}

document.getElementById("random-btn").addEventListener("click", randomize);

setUpButtons();

for (const cat in categories) {
  updateImage(cat);
}
