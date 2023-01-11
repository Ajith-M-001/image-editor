const fileInput = document.querySelector(".file-input"),
    filterOption = document.querySelectorAll(".filter button"),
    rotateOption = document.querySelectorAll(".rotate button"),
    previewImg = document.querySelector(".preview-img img"),
    filterName = document.querySelector(".filter-info .name"),
    filterValue = document.querySelector(".filter-info .value"),
    filterSlider = document.querySelector(".slider input"),
    chooseImgBtn = document.querySelector(".choose-img"),
    resetfilterBtn = document.querySelector(".reset-filter"),
    saveImgBtn = document.querySelector(".save-img");


let Brightness = 100, Saturation = 100, Inversion = 0, Grayscale = 0;
let rotate = 0, flipHorizontal = 1, flipVertical = 1;

const applyFilter = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipHorizontal},${flipVertical})`;
    previewImg.style.filter = `brightness(${Brightness}%) saturate(${Saturation}%) invert(${Inversion}%) grayscale(${Grayscale}%)`;
}

const loadImage = () => {
    let file = fileInput.files[0]; //getting user mselected file
    if (!file) return; // return if user hasn't selected file
    previewImg.src = URL.createObjectURL(file); //passing file url as preview img src
    previewImg.addEventListener("load", () => {
        document.querySelector(".container").classList.remove("disable");
    });
}

filterOption.forEach(option => {
    option.addEventListener("click", () => { // adding click event listener to all filter button
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "Brightness") {
            filterSlider.max = 200;
            filterSlider.value = Brightness;
            filterValue.innerText = `${Brightness}%`;
        } else if (option.id === "Saturation") {
            filterSlider.max = 200;
            filterSlider.value = Saturation;
            filterValue.innerText = `${Saturation}%`;
        } else if (option.id === "Inversion") {
            filterSlider.max = 100;
            filterSlider.value = Inversion;
            filterValue.innerText = `${Inversion}%`;
        } else {
            filterSlider.max = 100;
            filterSlider.value = Grayscale;
            filterValue.innerText = `${Grayscale}%`;
        }
    })
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active"); // getting selected filter btn
    if (selectedFilter.id === "Brightness") {
        Brightness = filterSlider.value;
    } else if (selectedFilter.id === "Saturation") {
        Saturation = filterSlider.value;
    } else if (selectedFilter.id === "Inversion") {
        Inversion = filterSlider.value;
    } else {
        Grayscale = filterSlider.value;
    }
    applyFilter();
}

rotateOption.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "horizontal") {
            flipHorizontal = flipHorizontal === 1 ? -1 : 1;
        } else {
            flipVertical = flipVertical === 1 ? -1 : 1;
        }
        applyFilter();
    })
});

const resetFilter = () => {
    Brightness = 100, Saturation = 100, Inversion = 0, Grayscale = 0;
    rotate = 0; flipHorizontal = 1, flipVertical = 1;
    filterOption[0].click();
    applyFilter();
}

const saveImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;

    ctx.filter = `brightness(${Brightness}%) saturate(${Saturation}%) invert(${Inversion}%) grayscale(${Grayscale}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotate !== 0) {
        ctx.rotate(rotate * Math.PI / 180);
    }
    ctx.scale(flipHorizontal, flipVertical);
    ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetfilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());