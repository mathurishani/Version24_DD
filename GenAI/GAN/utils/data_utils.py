def load_images(data_dir, image_size=(32, 32)):
  """
  Loads images from a directory and resizes them to a specified size.

  Args:
      data_dir: Path to the directory containing images.
      image_size: Desired size of the images (e.g., (32, 32) for CIFAR-10).

  Returns:
      A NumPy array of loaded and preprocessed images.
  """

  # Implement image loading logic here (e.g., using TensorFlow datasets or PIL)
  # This example assumes using TensorFlow datasets
  dataset = tf.keras.preprocessing.image_dataset_from_directory(
      data_dir,
      target_size=image_size,
      shuffle=True,
      seed=42,
      validation_split=0.2,
      subset="training"
  )

  # Convert the dataset to a NumPy array (be mindful of memory usage for large datasets)
  images = tf.keras.utils.array_to_img(list(dataset)[0][0]))

  return images


def normalize_images(images):
  """
  Normalizes image pixel values to a range between -1 and 1.

  Args:
      images: A NumPy array of images.

  Returns:
      A NumPy array of normalized images.
  """

  return images / 255.0 - 0.5  # Normalize to [-0.5, 0.5]

# You can add additional functions for specific preprocessing needs (e.g., data augmentation)
