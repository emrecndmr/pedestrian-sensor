// Create a video element to capture the camera feed
const video = document.createElement('video');

// Set the video element to play in a loop
video.autoplay = true;
video.loop = true;

// Load the object detection model
const model = await cocoSsd.load();

// Define a function to detect pedestrians in the video frame
const detectPedestrians = async (video) => {
  // Get the current video frame
  const videoFrame = tf.fromPixels(video);

  // Use the object detection model to detect pedestrians
  const detections = await model.detect(videoFrame);

  // Loop through the detections and draw bounding boxes around any pedestrians
  for (let i = 0; i < detections.length; i++) {
    // Check if the detected object is a pedestrian
    if (detections[i].class === 'person') {
      // Get the bounding box coordinates for the detected pedestrian
      const box = detections[i].bbox;

      // Draw a bounding box around the pedestrian
      drawBoundingBox(video, box[0], box[1], box[2], box[3]);
    }
  }

  // Schedule the next frame to be processed
  setTimeout(() => {
    detectPedestrians(video);
  }, 100);
}

// Define a function to draw a bounding box around a detected object
const drawBoundingBox = (video, x, y, width, height) => {
  // Get the 2D drawing context from the video element
  const context = canvas.getContext('2d');

  // Start drawing the bounding box
  context.beginPath();
  context.rect(x, y, width, height);

  // Set the line width and color for the bounding box
  context.lineWidth = 3;
  context.strokeStyle = 'red';

  // Draw the bounding box
  context.stroke();
}

// Start detecting pedestrians
detectPedestrians(video);
