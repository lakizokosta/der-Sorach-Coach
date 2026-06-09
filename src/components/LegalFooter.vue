<script setup>
/** Footer links to AGB, Datenschutz and Impressum. */
</script>

<template>
  <footer class="legal-footer">
    <div class="legal-footer__links">
      <router-link :to="{ name: 'legal', params: { slug: 'agb' } }">AGB</router-link>
      <router-link :to="{ name: 'legal', params: { slug: 'datenschutz' } }">Datenschutz</router-link>
      <router-link :to="{ name: 'legal', params: { slug: 'impressum' } }">Impressum</router-link>
    </div>
    <div class="legal-footer__copy">© 2026 Lernziel Deutsch | Der SprachCoach</div>
  </footer>
</template>
