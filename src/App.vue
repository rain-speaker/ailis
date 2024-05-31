<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/virtual-table">VirtualTable</RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer></footer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>
