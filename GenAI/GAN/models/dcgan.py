import tensorflow as tf
from tensorflow.keras.layers import Conv2D, Dense, Flatten, LeakyReLU, Reshape, UpSampling2D


def build_generator(noise_dim):
  """
  Defines the architecture of the generator network.

  Args:
      noise_dim: Dimension of the input noise vector.

  Returns:
      A compiled Keras sequential model representing the generator.
  """

  model = tf.keras.Sequential([
      Dense(7 * 7 * 256, use_bias=False, input_shape=(noise_dim,)),
      Reshape((7, 7, 256)),
      LeakyReLU(alpha=0.2),
      UpSampling2D((2, 2)),
      Conv2D(128, kernel_size=3, padding="same", use_bias=False),
      LeakyReLU(alpha=0.2),
      UpSampling2D((2, 2)),
      Conv2D(64, kernel_size=3, padding="same", use_bias=False),
      LeakyReLU(alpha=0.2),
      Conv2D(3, kernel_size=3, padding="same", activation="tanh"),
  ])

  return model


def build_discriminator(image_shape):
  """
  Defines the architecture of the discriminator network.

  Args:
      image_shape: Shape of the input image (e.g., (32, 32, 3) for CIFAR-10).

  Returns:
      A compiled Keras sequential model representing the discriminator.
  """

  model = tf.keras.Sequential([
      Conv2D(64, kernel_size=3, strides=2, padding="same", input_shape=image_shape),
      LeakyReLU(alpha=0.2),
      Conv2D(128, kernel_size=3, strides=2, padding="same"),
      LeakyReLU(alpha=0.2),
      Conv2D(256, kernel_size=3, strides=2, padding="same"),
      LeakyReLU(alpha=0.2),
      Flatten(),
      Dense(1, activation="sigmoid"),
  ])

  model.compile(loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
                optimizer=tf.keras.optimizers.Adam(learning_rate=0.0002),
                metrics=['accuracy'])

  return model


# This function is not included in the previous code snippets
def generate_and_save_images(model, epoch, noise_dim, image_shape, path="generated_images"):
  """
  Generates images from the model and saves them to a specified path.

  Args:
      model: The trained generator model.
      epoch: Current training epoch.
      noise_dim: Dimension of the noise vector.
      image_shape: Shape of the generated images.
      path: Path to save the generated images (default: "generated_images").
  """

  seed = tf.random.normal(shape=(16, noise_dim))
  generated_images = model(seed)

  # Implement image post-processing and saving logic here (e.g., using PIL)
  # This example assumes images are in the range [-1, 1] and need scaling to [0, 255]
  generated_images = (generated_images + 1) * 127.5
  generated_images.astype('uint8')
  # ... (Implement image saving logic using libraries like PIL)

