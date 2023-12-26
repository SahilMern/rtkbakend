const totalQuantity = 40;
const sizes = ["M", "L", "S", "XL"];
const genders = ["Male", "Female", "Children"];
const clothingTypes = ["Shirt", "Jeans", "T-shirt"];

const dummyData = [];

for (let i = 1; i <= totalQuantity; i++) {
  const quantity = Math.floor(Math.random() * 10) + 1; // Random quantity between 1 and 10

  const product = {
    id: i,
    name: `Product ${i}`,
    image: `image_${i}.jpg`,
    price: Math.floor(Math.random() * 100) + 1,
    discountPrice: Math.floor(Math.random() * 50) + 1,
    description: `Description for product ${i}`,
    sizes: {},
    gender: '',
    type: ''
  };

  let remainingQuantity = quantity;

  sizes.forEach((size, index) => {
    if (index < sizes.length - 1) {
      const random = Math.floor(Math.random() * remainingQuantity);
      product.sizes[size] = random;
      remainingQuantity -= random;
    } else {
      product.sizes[size] = remainingQuantity;
    }
  });

  const randomGenderIndex = Math.floor(Math.random() * genders.length);
  const randomClothingIndex = Math.floor(Math.random() * clothingTypes.length);

  const randomGender = genders[randomGenderIndex];
  const randomClothingType = clothingTypes[randomClothingIndex];

  product.gender = randomGender;
  product.type = randomClothingType;

  dummyData.push(product);
}

console.log(dummyData);
