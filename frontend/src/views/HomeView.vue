<script setup>
import { useMenuStore } from '@/stores/menu'

const menuStore = useMenuStore()
</script>

<template>
  <div class="p-2">
    <!-- Hero Section -->
    <div class="relative bg-gray-900 text-white">
      <div class="absolute inset-0">
        <img
          src="/images/hero-banner.jpg"
          alt="Restaurant Hero"
          class="w-full h-full object-cover opacity-50"
        />
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p class="uppercase text-sm tracking-widest mb-4">Welcome to our luxury hotel</p>
        <h1 class="text-5xl font-bold mb-6">Behind the Dishes</h1>
        <p class="text-lg mb-8">
          Experience world-class dining, luxurious rooms, and exceptional service. Indulge in the
          finest culinary delights and unforgettable moments.
        </p>
        <RouterLink
          to="/menu"
          class="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700"
        >
          Learn More
        </RouterLink>
      </div>
    </div>

    <!-- About Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="uppercase text-sm tracking-widest text-indigo-600 mb-2">Special Moments</p>
        <h2 class="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
        <p class="text-lg text-gray-600 mb-8">
          Nestled in the heart of the city, our hotel offers a perfect blend of luxury and comfort.
          Whether you're here for a romantic dinner, a family gathering, or a business meeting, we
          ensure an unforgettable experience.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="/images/about-1.png"
              alt="About Us"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-900">Traditional & Modern</h3>
              <p class="text-gray-600 mt-2">
                A perfect blend of traditional and modern culinary experiences.
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="/images/about-2.png"
              alt="About Us"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-900">Exceptional Service</h3>
              <p class="text-gray-600 mt-2">
                Our team is dedicated to providing you with the best service.
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src="/images/about-3.png"
              alt="About Us"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-bold text-gray-900">Luxurious Ambiance</h3>
              <p class="text-gray-600 mt-2">
                Enjoy a luxurious ambiance that makes every moment special.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Dishes Section -->
    <div class="py-16 bg-gray-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="uppercase text-sm tracking-widest text-indigo-400 mb-2">Our Healthy Food</p>
        <h2 class="text-3xl font-bold mb-6">Our Specials</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="item in menuStore.featuredItems"
            :key="item.id"
            class="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <h3 class="text-lg font-bold text-white">{{ item.name }}</h3>
              <p class="text-gray-400 mt-2 line-clamp-2">{{ item.description }}</p>
              <p class="text-indigo-400 font-bold mt-4">${{ item.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call-to-Action Section -->
    <div class="py-16 bg-indigo-600 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl font-bold mb-4">Ready to Experience Luxury?</h2>
        <p class="text-lg mb-8">
          Book your table or explore our menu to indulge in the finest dining experience.
        </p>
        <div class="flex justify-center gap-4">
          <RouterLink
            to="/menu"
            class="bg-white text-indigo-600 px-8 py-3 rounded-lg border-2 border-white hover:bg-indigo-50"
          >
            View Menu
          </RouterLink>
          <RouterLink
            to="/reservation"
            class="bg-white text-indigo-600 px-8 py-3 rounded-lg border-2 border-white hover:bg-indigo-50"
          >
            Book Now
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>