// fetchImage.js
const APIkey = '42681683-2db510e85ab3e036a4dc3d807';

const fetchImage = async (searchTerm) => {
  try {
    const response = await fetch(`https://pixabay.com/api/?key=${APIkey}&q=${searchTerm}&image_type=photo&safesearch=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch image: Network response was not ok');
    }
    const data = await response.json();
    console.log('Image data:', data);
    const imageUrl = data.hits[0].largeImageURL; // Adjust based on Pixabay API response structure
    console.log('Image URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image:', error.message);
    return null;
  }
};

export default fetchImage;
