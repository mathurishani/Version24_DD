import tensorflow as tf
from tensorflow.keras.layers import Conv2D, Dense, Flatten, LeakyReLU, Reshape, UpSampling2D
from tensorflow.keras.datasets import cifar10


def build_generator(noise_dim):

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

  return model


def train(epochs, batch_size, noise_dim, image_shape):

  # Load dataset (modify for your data loading logic)
  (train_images, _), (_, _) = cifar10.load_data()
  train_images = train_images.astype('float32')
  train_images = (train_images - 127.5) / 127.5

  # Build models
  generator = build_generator(noise_dim)
  discriminator = build_discriminator(image_shape)

  # Define Loss functions and optimizers
  cross_entropy = tf.keras.losses.BinaryCrossentropy(from_logits=True)

  # Optimizers for discriminator and generator (adjust learning rates as needed)
  discriminator_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0002)
  generator_optimizer = tf.keras.optimizers.Adam(learning_rate=0.0001)

  # Compile Discriminator
  discriminator.compile(loss=cross_entropy, optimizer=discriminator_optimizer, metrics=['accuracy'])

  # Compile GAN - combines generator and discriminator for training the generator
  gan_model = tf.keras.models.Sequential([generator, discriminator])
  gan_model.compile(loss=cross_entropy, optimizer=generator_optimizer)

  # Training loop
  for epoch in range(epochs):
    print(f"Epoch {epoch+1}/{epochs}")

    # Train Discriminator on real and fake images
    for _ in range(batch_count):
      real_images = train_images[np.random.randint(0, len(train_images), size=batch_size)]
      noise = tf.random.normal(shape=(batch_size, noise_dim))
      fake_images = generator(noise)

      # Train discriminator on real and fake images
      discriminator.train_on_batch(real_images, tf.ones((batch_size, 1)))
      discriminator.train_on_batch(fake_images, tf.zeros((batch_size, 1)))

    # Train Generator - set discriminator non-trainable
    discriminator.trainable = False
    noise = tf.random.normal(shape=(batch_size, noise_dim))
    gan_model.train_on_batch(noise, tf.ones((batch_size, 1)))
    discriminator.trainable = True

    # Generate and save images periodically (optional)
    if epoch % 5 == 0:
      generated_images = generator(noise)
      # Implement image saving logic here (e.g., using TensorFlow datasets)

  # Save the trained models (optional)
