document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on the edit profile page
    if (document.getElementById('profile-form')) {
      // Pre-fill form with existing data from localStorage
      document.getElementById('name').value = localStorage.getItem('name') || 'John Doe';
      document.getElementById('email').value = localStorage.getItem('email') || 'john.doe@example.com';
      document.getElementById('location').value = localStorage.getItem('location') || 'New York, USA';
  
      // Handle form submission for saving profile updates
      document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent form from submitting traditionally (no page refresh)
  
        // Capture updated form data
        const updatedName = document.getElementById('name').value;
        const updatedEmail = document.getElementById('email').value;
        const updatedLocation = document.getElementById('location').value;
  
        // Save updated data to localStorage
        localStorage.setItem('name', updatedName);
        localStorage.setItem('email', updatedEmail);
        localStorage.setItem('location', updatedLocation);
  
        // Redirect to the View Profile page
        window.location.href = 'view-profile.html';
      });
    }
  
    // Check if we are on the view profile page
    if (document.getElementById('profile-name')) {
      // Display the updated profile data on the view profile page
      const name = localStorage.getItem('name') || 'John Doe';
      const email = localStorage.getItem('email') || 'john.doe@example.com';
      const location = localStorage.getItem('location') || 'New York, USA';
  
      document.getElementById('profile-name').textContent = name;
      document.getElementById('profile-email').textContent = email;
      document.getElementById('profile-location').textContent = location;
    }
  });
  

  // Select the profile picture and file input elements
const profileImg = document.getElementById('profile-img');
const fileInput = document.getElementById('file-input');

// Load the profile picture from localStorage on page load
window.addEventListener('load', () => {
  const savedImage = localStorage.getItem('profileImage'); // Get the saved image from localStorage
  if (savedImage) {
    profileImg.src = savedImage; // Set the profile image src to the saved image
  }
});

// Event listener to trigger file input when profile picture is clicked
profileImg.addEventListener('click', () => {
  fileInput.click(); // Simulate a click on the file input
});

// Event listener for file input change
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0]; // Get the selected file
  if (file) {
    const reader = new FileReader(); // Create a FileReader to read the file
    reader.onload = (e) => {
      profileImg.src = e.target.result; // Update the profile picture with the new image
      localStorage.setItem('profileImage', e.target.result); // Save the new image to localStorage
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
});


document.getElementById('change-video').addEventListener('click', function() {
    const videoUrl = document.getElementById('video-url').value; // Get the input value
    const videoSource = document.getElementById('video-source'); // Get the source element
  
    if (videoUrl) {
      videoSource.src = videoUrl; // Set the new source
      const video = document.getElementById('background-video');
      video.load(); // Load the new video
    } else {
      alert("Please enter a valid video URL."); // Alert if the input is empty
    }
  });
  